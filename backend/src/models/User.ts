import { db } from '../config/database';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

class UserModel {
  async find(query: any = {}) {
    const result = await db.collection('users').find(query);
    return result.results;
  }

  async findOne(query: any) {
    return await db.collection('users').findOne(query);
  }

  async create(data: Partial<IUser>) {
    const user = {
      ...data,
      _id: Date.now().toString(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    } as IUser;
    await db.collection('users').insertOne(user);
    return user;
  }

  async findByIdAndUpdate(id: string, update: any) {
    await db.collection('users').updateOne({ _id: id }, { $set: update });
    return await this.findOne({ _id: id });
  }

  async deleteMany(query: any = {}) {
    return await db.collection('users').deleteMany(query);
  }

  // Password comparison (simple for demo)
  comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return Promise.resolve(candidatePassword === hashedPassword); // In production, use bcrypt
  }
}

const User = new UserModel();
export default User;