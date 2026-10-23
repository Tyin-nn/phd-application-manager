// === State Store ===
const STORAGE_KEY = 'phd_app_state';
const DATA_VERSION = 5; // bump to force re-seed on schema/seed changes

const APP_STATUSES = [
  { value: '未开始', label: '未开始', cls: 'na' },
  { value: '已套磁', label: '已套磁', cls: 'contacted' },
  { value: '材料准备中', label: '准备中', cls: 'preparing' },
  { value: '已提交', label: '已提交', cls: 'submitted' },
  { value: '面试', label: '面试', cls: 'interview' },
  { value: 'Offer', label: 'Offer', cls: 'offer' },
  { value: '拒信', label: '拒信', cls: 'rejected' },
  { value: '放弃', label: '放弃', cls: 'dropped' },
];

function appStatusLabel(s) {
  const f = APP_STATUSES.find(x => x.value === s);
  return f ? f.label : (s || '未开始');
}

function appStatusClass(s) {
  const f = APP_STATUSES.find(x => x.value === s);
  return f ? f.cls : 'na';
}

const AppState = {
  programs: [],
  materials: {},    // { [programId]: [ { id, label, status, notes }, ... ] }
  recommenders: [],
  documents: [],

  init() {
    const versionKey = STORAGE_KEY + '_version';
    const savedVersion = localStorage.getItem(versionKey);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && parseInt(savedVersion) === DATA_VERSION) {
      try {
        const data = JSON.parse(saved);
        this.programs = data.programs || [];
        this.materials = data.materials || {};
        this.recommenders = data.recommenders || [];
        this.documents = data.documents || [];
      } catch (e) {
        console.error('Failed to parse saved state, re-seeding...');
        this.seed();
      }
    } else if (saved) {
      // Version mismatch → migrate user data, merging in new seed entries
      try {
        const data = JSON.parse(saved);
        this.programs = data.programs || [];
        this.materials = data.materials || {};
        this.recommenders = data.recommenders || [];
        this.documents = data.documents || [];
        this.migrate();
        this.save();
      } catch (e) {
        console.error('Failed to parse saved state, re-seeding...');
        this.seed();
      }
    } else {
      // New user → fresh seed
      this.seed();
    }
  },

  // Merge user data with current seed without losing user edits.
  // Programs matched by institution; documents by title; material templates merged per program.
  migrate() {
    const seedPrograms = SeedData.getPrograms();
    const existingInstitutions = new Set(this.programs.map(p => p.institution));
    seedPrograms.forEach(sp => {
      if (!existingInstitutions.has(sp.institution)) {
        this.programs.push(sp);
      }
    });

    const seedDocs = SeedData.getDocuments();
    const existingTitles = new Set(this.documents.map(d => d.title));
    seedDocs.forEach(sd => {
      if (!existingTitles.has(sd.title)) {
        this.documents.push(sd);
      }
    });

    // Normalize fields added in v3
    this.programs.forEach(p => {
      if (!p.appStatus) p.appStatus = '未开始';
      if (!Array.isArray(p.contacts)) p.contacts = [];
      this.ensureMaterials(p.id); // adds any new template labels
    });
    this.documents.forEach(d => {
      d.requirements = d.requirements || '';
      if (!d.status) d.status = '草稿';
      d.versions = d.versions || [];
    });
  },

  seed() {
    SeedData.seed(this);
    // Normalize v3 fields on freshly seeded data
    this.programs.forEach(p => {
      if (!p.appStatus) p.appStatus = '未开始';
      if (!Array.isArray(p.contacts)) p.contacts = [];
    });
    this.save();
  },

  save() {
    const data = {
      programs: this.programs,
      materials: this.materials,
      recommenders: this.recommenders,
      documents: this.documents,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEY + '_version', DATA_VERSION);
  },

  // === Program methods ===
  getProgram(id) {
    return this.programs.find(p => p.id === id);
  },

  addProgram(program) {
    program.id = generateId();
    program.status = program.status || 'active';
    program.tier = program.tier || '';
    program.deadline = program.deadline || '';
    program.funding = program.funding || '';
    program.location = program.location || '';
    if (!program.appStatus) program.appStatus = '未开始';
    if (!Array.isArray(program.contacts)) program.contacts = [];
    this.programs.push(program);
    this.ensureMaterials(program.id);
    this.save();
    return program;
  },

  updateProgram(id, updates) {
    const idx = this.programs.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.programs[idx] = { ...this.programs[idx], ...updates };
      this.save();
    }
  },

  deleteProgram(id) {
    this.programs = this.programs.filter(p => p.id !== id);
    delete this.materials[id];
    // Remove from recommender assignments
    this.recommenders.forEach(r => {
      r.assignedProgramIds = (r.assignedProgramIds || []).filter(pid => pid !== id);
    });
    this.save();
  },

  // === Material methods ===
  ensureMaterials(programId) {
    if (!this.materials[programId]) {
      this.materials[programId] = MATERIAL_TEMPLATES.map(t => ({
        id: generateId(),
        label: t.label,
        status: '未开始',
        notes: '',
      }));
    } else {
      // Merge in template labels added after the program was created
      const mats = this.materials[programId];
      MATERIAL_TEMPLATES.forEach(t => {
        if (!mats.some(m => m.label === t.label)) {
          mats.push({ id: generateId(), label: t.label, status: '未开始', notes: '' });
        }
      });
    }
  },

  getMaterials(programId) {
    this.ensureMaterials(programId);
    return this.materials[programId];
  },

  updateMaterial(programId, materialId, updates) {
    this.ensureMaterials(programId);
    const mats = this.materials[programId];
    const idx = mats.findIndex(m => m.id === materialId);
    if (idx !== -1) {
      mats[idx] = { ...mats[idx], ...updates };
      this.save();
    }
  },

  getProgramMaterialProgress(programId) {
    const mats = this.getMaterials(programId);
    const applicable = mats.filter(m => m.status !== '不适用');
    if (applicable.length === 0) return 0;
    const done = applicable.filter(m => m.status === '已完成').length;
    return Math.round((done / applicable.length) * 100);
  },

  getOverallProgress() {
    const programIds = this.programs.filter(p => p.status === 'active').map(p => p.id);
    if (programIds.length === 0) return 0;
    const avg = programIds.reduce((sum, pid) => sum + this.getProgramMaterialProgress(pid), 0);
    return Math.round(avg / programIds.length);
  },

  // === Recommender methods ===
  getRecommender(id) {
    return this.recommenders.find(r => r.id === id);
  },

  addRecommender(rec) {
    rec.id = generateId();
    rec.assignedProgramIds = rec.assignedProgramIds || [];
    this.recommenders.push(rec);
    this.save();
    return rec;
  },

  updateRecommender(id, updates) {
    const idx = this.recommenders.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.recommenders[idx] = { ...this.recommenders[idx], ...updates };
      this.save();
    }
  },

  deleteRecommender(id) {
    this.recommenders = this.recommenders.filter(r => r.id !== id);
    this.save();
  },

  getRecommendersForProgram(programId) {
    return this.recommenders.filter(r =>
      (r.assignedProgramIds || []).includes(programId)
    );
  },

  toggleRecommenderAssignment(recommenderId, programId) {
    const rec = this.getRecommender(recommenderId);
    if (!rec) return;
    const ids = rec.assignedProgramIds || [];
    if (ids.includes(programId)) {
      rec.assignedProgramIds = ids.filter(id => id !== programId);
    } else {
      rec.assignedProgramIds = [...ids, programId];
    }
    this.save();
  },

  // === Document methods ===
  getDocument(id) {
    return this.documents.find(d => d.id === id);
  },

  addDocument(doc) {
    doc.id = generateId();
    doc.versions = doc.versions || [];
    doc.requirements = doc.requirements || '';
    if (!doc.content) doc.content = '';
    if (doc.content && doc.versions.length === 0) {
      doc.versions.push({
        id: generateId(),
        content: doc.content,
        createdAt: new Date().toISOString(),
        label: 'v1 (初始版本)',
      });
    }
    this.documents.push(doc);
    this.save();
    return doc;
  },

  updateDocument(id, updates) {
    const idx = this.documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.documents[idx] = { ...this.documents[idx], ...updates };
      this.save();
    }
  },

  deleteDocument(id) {
    this.documents = this.documents.filter(d => d.id !== id);
    this.save();
  },

  saveDocVersion(docId, content, label) {
    const doc = this.getDocument(docId);
    if (!doc) return;
    const version = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString(),
      label: label || `v${doc.versions.length + 1}`,
    };
    doc.versions.push(version);
    doc.content = content;
    this.save();
    return version;
  },

  // === Contact (套磁) methods ===
  addContact(programId, contact) {
    const p = this.getProgram(programId);
    if (!p) return;
    if (!Array.isArray(p.contacts)) p.contacts = [];
    contact.id = generateId();
    contact.replyStatus = contact.replyStatus || '未回复';
    p.contacts.push(contact);
    this.save();
    return contact;
  },

  removeContact(programId, contactId) {
    const p = this.getProgram(programId);
    if (!p) return;
    p.contacts = (p.contacts || []).filter(c => c.id !== contactId);
    this.save();
  },

  // === Backup ===
  exportData() {
    return {
      app: 'phd-manager',
      version: DATA_VERSION,
      exportedAt: new Date().toISOString(),
      programs: this.programs,
      materials: this.materials,
      recommenders: this.recommenders,
      documents: this.documents,
    };
  },

  importData(data) {
    if (!data || data.app !== 'phd-manager' || !Array.isArray(data.programs)) {
      throw new Error('无效的备份文件');
    }
    this.programs = data.programs;
    this.materials = data.materials || {};
    this.recommenders = data.recommenders || [];
    this.documents = data.documents || [];
    // Normalize fields in case the backup predates v3
    this.programs.forEach(p => {
      if (!p.appStatus) p.appStatus = '未开始';
      if (!Array.isArray(p.contacts)) p.contacts = [];
      this.ensureMaterials(p.id);
    });
    this.save();
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '_version');
    this.programs = [];
    this.materials = {};
    this.recommenders = [];
    this.documents = [];
    this.seed();
  },
};

const MATERIAL_TEMPLATES = [
  { label: 'Writing Sample' },
  { label: 'CV' },
  { label: 'SOP' },
  { label: 'Transcript' },
  { label: 'Recommendation Letters' },
  { label: 'Application Fee' },
];
