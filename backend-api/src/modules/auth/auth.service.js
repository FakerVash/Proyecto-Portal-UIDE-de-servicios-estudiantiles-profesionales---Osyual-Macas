import bcrypt from 'bcrypt';

export class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async register(data) {
        const existingUser = await this.prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.usuario.create({
            data: {
                email: data.email,
                contrasena: hashedPassword,
                nombre: data.nombre,
                apellido: data.apellido,
                rol: data.rol || 'CLIENTE', // Default
                telefono: data.telefono,
            },
        });

        return user;
    }

    async login(email, password) {
        const user = await this.prisma.usuario.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const validPassword = await bcrypt.compare(password, user.contrasena);

        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }

        return user;
    }
}
