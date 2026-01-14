import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Roles
    const roles = [
        { nombre: 'admin', descripcion: 'Administrador con control total sobre usuarios y contenidos' },
        { nombre: 'cliente', descripcion: 'Usuario que contrata servicios y califica estudiantes' },
        { nombre: 'estudiante', descripcion: 'Usuario que ofrece servicios y gestiona sus ventas' },
    ];

    for (const role of roles) {
        const r = await prisma.role.upsert({
            where: { nombre: role.nombre },
            update: {},
            create: role,
        });
        console.log(`Created/Updated role: ${r.nombre}`);
    }

    // 2. Categorías
    const categories = [
        { nombre: 'Tutorías', icono: 'book', descripcion: 'Apoyo académico en diversas materias' },
        { nombre: 'Programación', icono: 'code', descripcion: 'Desarrollo web, apps y software' },
        { nombre: 'Diseño', icono: 'palette', descripcion: 'Diseño gráfico, logos e ilustración' },
        { nombre: 'Negocios', icono: 'briefcase', descripcion: 'Asesoría en proyectos y marketing' },
        { nombre: 'Ciencias', icono: 'microscope', descripcion: 'Física, química y matemáticas avanzadas' },
    ];

    for (const category of categories) {
        const c = await prisma.categoria.upsert({
            where: { nombre: category.nombre },
            update: {},
            create: category,
        });
        console.log(`Created/Updated category: ${c.nombre}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
