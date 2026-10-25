import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

// Configuración abierta de CORS para evitar bloqueos
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 1. Obtener todos los empleados de la base de datos
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Crear un nuevo empleado en la base de datos
app.post('/api/employees', async (req, res) => {
  try {
    const data = req.body;
    const newEmployee = await prisma.employee.create({
      data: {
        lastName: data.lastName,
        firstName: data.firstName,
        status: data.status || 'Activo',
        contractType: data.contractType || 'Minijob',
        startDate: data.startDate ? new Date(data.startDate) : null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        krankenkasse: data.krankenkasse,
        stNummer: data.stNummer,
        svNummer: data.svNummer,
        address: data.address,
        zipCode: data.zipCode,
        city: data.city
      }
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/employees/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { status }
    });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});