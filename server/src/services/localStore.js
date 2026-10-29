/**
 * @file services/localStore.js
 * @description File-backed local storage fallback when MongoDB is not running locally.
 * Ensures zero-configuration demo & evaluation capability for the entire app.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ users: [], resumes: [], analyses: [] }, null, 2),
      'utf-8'
    );
  }
}

function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], resumes: [], analyses: [] };
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

/* ── User Repository Fallback ── */
const userRepo = {
  findOne({ email }) {
    const fetchUser = async () => {
      const db = readData();
      const user = db.users.find(
        (u) => u.email.toLowerCase() === (email || '').toLowerCase()
      );
      if (!user) return null;
      return {
        ...user,
        _id: user.id,
        toJSON() {
          const copy = { ...user, id: user.id };
          delete copy.passwordHash;
          return copy;
        },
        async comparePassword(candidate) {
          return bcrypt.compare(candidate, user.passwordHash);
        },
      };
    };

    const promise = fetchUser();
    return {
      select() {
        return promise;
      },
      then(onFulfilled, onRejected) {
        return promise.then(onFulfilled, onRejected);
      },
      catch(onRejected) {
        return promise.catch(onRejected);
      },
    };
  },

  async findById(id) {
    const db = readData();
    const user = db.users.find((u) => u.id === id || u._id === id);
    if (!user) return null;
    return {
      ...user,
      _id: user.id,
      toJSON() {
        const copy = { ...user, id: user.id };
        delete copy.passwordHash;
        return copy;
      },
    };
  },

  async create({ email, passwordHash, role = 'user' }) {
    const db = readData();
    const id = generateId();
    const newUser = {
      id,
      _id: id,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeData(db);
    return {
      ...newUser,
      toJSON() {
        const copy = { ...newUser };
        delete copy.passwordHash;
        return copy;
      },
      async comparePassword(candidate) {
        return bcrypt.compare(candidate, newUser.passwordHash);
      },
    };
  },

  async findByIdAndDelete(id) {
    const db = readData();
    db.users = db.users.filter((u) => u.id !== id && u._id !== id);
    writeData(db);
  },
};

/* ── Resume Repository Fallback ── */
const resumeRepo = {
  find(query = {}) {
    const fetchResults = () => {
      const db = readData();
      let results = db.resumes || [];
      if (query.userId) {
        const uId = query.userId?.toString();
        results = results.filter(
          (r) => r.userId === query.userId || r.userId?.toString() === uId
        );
      }
      return results;
    };

    return {
      sort() {
        return {
          lean() {
            const list = fetchResults();
            return Promise.resolve(
              list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            );
          },
          then(onFulfilled, onRejected) {
            const list = fetchResults();
            return Promise.resolve(
              list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            ).then(onFulfilled, onRejected);
          },
        };
      },
      lean() {
        return Promise.resolve(fetchResults());
      },
      select() {
        return Promise.resolve(fetchResults());
      },
      then(onFulfilled, onRejected) {
        return Promise.resolve(fetchResults()).then(onFulfilled, onRejected);
      },
    };
  },

  async findById(id) {
    const db = readData();
    const item = db.resumes.find((r) => r.id === id || r._id === id);
    if (!item) return null;
    const doc = {
      ...item,
      _id: item.id,
      select() {
        return this;
      },
      toJSON() {
        const copy = { ...this };
        delete copy.save;
        delete copy.select;
        return copy;
      },
      async save() {
        const currentDb = readData();
        const idx = currentDb.resumes.findIndex((r) => r.id === id || r._id === id);
        const updated = {
          ...this,
          id: item.id,
          _id: item.id,
          updatedAt: new Date().toISOString(),
        };
        delete updated.save;
        delete updated.select;
        if (idx !== -1) {
          currentDb.resumes[idx] = updated;
        } else {
          currentDb.resumes.unshift(updated);
        }
        writeData(currentDb);
        return this;
      },
    };
    return doc;
  },

  async create(payload) {
    const db = readData();
    const id = generateId();
    const now = new Date().toISOString();
    const newResume = {
      id,
      _id: id,
      userId: payload.userId,
      title: payload.title || 'Untitled Resume',
      templateId: payload.templateId || 'classic',
      sections: payload.sections || {},
      imageUrl: payload.imageUrl || '',
      createdAt: now,
      updatedAt: now,
    };
    db.resumes.unshift(newResume);
    writeData(db);
    return {
      ...newResume,
      toJSON() {
        return { ...newResume };
      },
    };
  },

  async findByIdAndUpdate(id, update, options = {}) {
    const db = readData();
    const index = db.resumes.findIndex((r) => r.id === id || r._id === id);
    if (index === -1) return null;

    const existing = db.resumes[index];
    const updated = {
      ...existing,
      ...update,
      id: existing.id,
      _id: existing.id,
      updatedAt: new Date().toISOString(),
    };
    db.resumes[index] = updated;
    writeData(db);
    return {
      ...updated,
      toJSON() {
        return { ...updated };
      },
    };
  },

  async findByIdAndDelete(id) {
    const db = readData();
    db.resumes = db.resumes.filter((r) => r.id !== id && r._id !== id);
    writeData(db);
  },

  async deleteMany(filter = {}) {
    const db = readData();
    if (filter.userId) {
      db.resumes = db.resumes.filter((r) => r.userId !== filter.userId);
      writeData(db);
    }
  },
};

/* ── Analysis Repository Fallback ── */
const analysisRepo = {
  find(query = {}) {
    const fetchResults = () => {
      const db = readData();
      let results = db.analyses || [];
      if (query.resumeId) {
        const matchId = (query.resumeId._id || query.resumeId)?.toString();
        results = results.filter(
          (a) => a.resumeId === matchId || a.resumeId?.toString() === matchId
        );
      }
      return results;
    };

    return {
      sort() {
        return {
          lean() {
            const list = fetchResults();
            return Promise.resolve(
              list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            );
          },
          then(onFulfilled, onRejected) {
            const list = fetchResults();
            return Promise.resolve(
              list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ).then(onFulfilled, onRejected);
          },
        };
      },
      lean() {
        return Promise.resolve(fetchResults());
      },
      then(onFulfilled, onRejected) {
        return Promise.resolve(fetchResults()).then(onFulfilled, onRejected);
      },
    };
  },

  async findById(id) {
    const db = readData();
    const item = db.analyses.find((a) => a.id === id || a._id === id);
    if (!item) return null;
    return {
      ...item,
      _id: item.id,
      toJSON() {
        return { ...item, id: item.id };
      },
    };
  },

  async create(payload) {
    const db = readData();
    const id = generateId();
    const newAnalysis = {
      id,
      _id: id,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    db.analyses.unshift(newAnalysis);
    writeData(db);
    return {
      ...newAnalysis,
      toJSON() {
        return { ...newAnalysis };
      },
    };
  },

  async deleteMany(filter = {}) {
    const db = readData();
    if (filter.resumeId) {
      if (filter.resumeId.$in) {
        const set = new Set(filter.resumeId.$in.map((x) => x.toString()));
        db.analyses = db.analyses.filter((a) => !set.has(a.resumeId?.toString()));
      } else {
        db.analyses = db.analyses.filter(
          (a) => a.resumeId !== filter.resumeId && a.resumeId?.toString() !== filter.resumeId?.toString()
        );
      }
      writeData(db);
    }
  },
};

module.exports = {
  userRepo,
  resumeRepo,
  analysisRepo,
};
