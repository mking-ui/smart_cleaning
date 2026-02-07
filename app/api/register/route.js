// app/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/config/db';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();

  const {
    role,
    firstName,
    surname,
    email,
    phone,
    username,
    password
  } = await req.json();

  try {
    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    // Supervisor limit check
    if (role === 'Supervisor') {
      const supervisorCount = await User.countDocuments({ role: 'Supervisor' });
      if (supervisorCount >= 2) {
        return NextResponse.json({ message: 'Supervisor limit reached' }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      role,
      firstName,
      surname,
      email,
      phone,
      username,
      password: hashedPassword
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        role: newUser.role,
        username: newUser.username,
        status: newUser.status
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Registration failed', error: error.message }, { status: 500 });
  }
}
