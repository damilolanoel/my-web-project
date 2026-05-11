// Simple in-memory database for manual use
class InMemoryDB {
  private data: { [collection: string]: any[] } = {
    users: [],
    contributions: [],
    payouts: [],
    notifications: []
  };

  async connect(): Promise<void> {
    console.log('📄 In-Memory Database Connected (Manual Mode)');
  }

  collection(name: string) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return {
      find: (query: any) => {
        let results = this.data[name];
        if (query) {
          // Simple query matching
          results = results.filter(item => {
            for (const key in query) {
              if (item[key] !== query[key]) return false;
            }
            return true;
          });
        }
        return {
          sort: (sort: any) => ({ results }),
          limit: (limit: number) => ({ results: results.slice(0, limit) }),
          results
        };
      },
      findOne: (query: any) => {
        const results = this.collection(name).find(query).results;
        return results[0] || null;
      },
      insertOne: (doc: any) => {
        doc._id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        doc.createdAt = new Date();
        doc.updatedAt = new Date();
        this.data[name].push(doc);
        return { insertedId: doc._id };
      },
      updateOne: (query: any, update: any) => {
        const index = this.data[name].findIndex(item => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
        if (index !== -1) {
          Object.assign(this.data[name][index], update.$set || update, { updatedAt: new Date() });
          return { modifiedCount: 1 };
        }
        return { modifiedCount: 0 };
      },
      deleteMany: (query: any) => {
        if (!query || Object.keys(query).length === 0) {
          const count = this.data[name].length;
          this.data[name] = [];
          return { deletedCount: count };
        }
        const initialLength = this.data[name].length;
        this.data[name] = this.data[name].filter(item => {
          for (const key in query) {
            if (item[key] === query[key]) return false;
          }
          return true;
        });
        return { deletedCount: initialLength - this.data[name].length };
      }
    };
  }
}

const db = new InMemoryDB();

const connectDB = async (): Promise<void> => {
  await db.connect();
};

export { connectDB, db };