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

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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

app.get('/api/employees/:id/earnings', async (req, res) => {
  try {
    const { id } = req.params;
    let config = await prisma.employeeEarningsConfig.findUnique({ where: { employeeId: id } });
    if (!config) {
      config = await prisma.employeeEarningsConfig.create({
        data: { employeeId: id }
      });
    }
    const weeks = await prisma.employeeWeek.findMany({
      where: { employeeId: id },
      orderBy: { createdAt: 'asc' }
    });
    const fines = await prisma.employeeFine.findMany({
      where: { employeeId: id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ config, weeks, fines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employees/:id/earnings/config', async (req, res) => {
  try {
    const { id } = req.params;
    const { contractType, contractHours, hourlyRate, commissionRate, vacationProvision, cashPaidInHand } = req.body;

    const updated = await prisma.employeeEarningsConfig.upsert({
      where: { employeeId: id },
      update: { contractType, contractHours, hourlyRate, commissionRate, vacationProvision, cashPaidInHand },
      create: { employeeId: id, contractType, contractHours, hourlyRate, commissionRate, vacationProvision, cashPaidInHand }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees/:id/weeks', async (req, res) => {
  try {
    const { id } = req.params;
    const { kw, dateRange, fahrtpreis, aktion, serviceFee, tip } = req.body;

    const newWeek = await prisma.employeeWeek.create({
      data: {
        employeeId: id,
        kw,
        dateRange,
        fahrtpreis: parseFloat(fahrtpreis) || 0,
        aktion: parseFloat(aktion) || 0,
        serviceFee: parseFloat(serviceFee) || 0,
        tip: parseFloat(tip) || 0
      }
    });

    res.json(newWeek);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/weeks/:weekId', async (req, res) => {
  try {
    const { weekId } = req.params;
    await prisma.employeeWeek.delete({ where: { id: weekId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees/:id/fines', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, aktenzeichen, pin, amount } = req.body;

    const newFine = await prisma.employeeFine.create({
      data: {
        employeeId: id,
        description,
        aktenzeichen,
        pin,
        amount: parseFloat(amount) || 0
      }
    });

    res.json(newFine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/fines/:fineId', async (req, res) => {
  try {
    const { fineId } = req.params;
    await prisma.employeeFine.delete({ where: { id: fineId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});