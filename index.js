const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// 1. DATOS EN MEMORIA (Simulación)
let usuariosData = [
    { id: 1, nombre: 'Ana Gómez', correo: 'ana@correo.com' },
    { id: 2, nombre: 'Carlos Pérez', correo: 'carlos@correo.com' },
    { id: 3, nombre: 'Laura Torres', correo: 'laura@correo.com' }
];

// Variable para generar IDs automáticos
let nextId = 4;

// 2. ESQUEMA (Con Queries y Mutations)
const schema = buildSchema(`
    # Definición del tipo Usuario
    type Usuario {
        id: Int!
        nombre: String!
        correo: String!
    }

    # Queries - Lectura de datos
    type Query {
        # Obtener todos los usuarios
        usuarios: [Usuario!]!
        # Obtener un usuario por ID
        usuario(id: Int!): Usuario
    }

    # Mutations - Escritura/Modificación de datos
    type Mutation {
        # Crear un nuevo usuario
        crearUsuario(nombre: String!, correo: String!): Usuario!
        
        # Actualizar un usuario existente
        actualizarUsuario(id: Int!, nombre: String, correo: String): Usuario!
        
        # Eliminar un usuario
        eliminarUsuario(id: Int!): String!
    }
`);

// 3. RESOLVERS
const root = {
    // ===== QUERIES =====
    
    // Listar todos los usuarios
    usuarios: () => {
        console.log('📋 Listando todos los usuarios');
        return usuariosData;
    },

    // Buscar usuario por ID
    usuario: ({ id }) => {
        console.log(`🔍 Buscando usuario con ID: ${id}`);
        const usuario = usuariosData.find(u => u.id === id);
        if (!usuario) {
            console.log(`❌ Usuario con ID ${id} no encontrado`);
            return null;
        }
        console.log(`✅ Usuario encontrado: ${usuario.nombre}`);
        return usuario;
    },

    // ===== MUTATIONS =====

    // Crear un nuevo usuario
    crearUsuario: ({ nombre, correo }) => {
        console.log(`➕ Creando nuevo usuario: ${nombre}`);
        
        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre es obligatorio');
        }
        if (!correo || correo.trim() === '') {
            throw new Error('El correo es obligatorio');
        }
        
        // Crear el nuevo usuario
        const nuevoUsuario = {
            id: nextId++,
            nombre: nombre.trim(),
            correo: correo.trim()
        };
        
        usuariosData.push(nuevoUsuario);
        console.log(`✅ Usuario creado con ID ${nuevoUsuario.id}`);
        console.log(`📊 Total usuarios: ${usuariosData.length}`);
        return nuevoUsuario;
    },

    // Actualizar un usuario existente
    actualizarUsuario: ({ id, nombre, correo }) => {
        console.log(`✏️ Actualizando usuario con ID: ${id}`);
        
        // Buscar el usuario
        const usuarioIndex = usuariosData.findIndex(u => u.id === id);
        if (usuarioIndex === -1) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        
        // Actualizar solo los campos que vienen
        if (nombre && nombre.trim() !== '') {
            usuariosData[usuarioIndex].nombre = nombre.trim();
        }
        if (correo && correo.trim() !== '') {
            usuariosData[usuarioIndex].correo = correo.trim();
        }
        
        console.log(`✅ Usuario actualizado: ${usuariosData[usuarioIndex].nombre}`);
        return usuariosData[usuarioIndex];
    },

    // Eliminar un usuario
    eliminarUsuario: ({ id }) => {
        console.log(`🗑️ Eliminando usuario con ID: ${id}`);
        
        // Buscar el usuario
        const usuarioIndex = usuariosData.findIndex(u => u.id === id);
        if (usuarioIndex === -1) {
            throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        
        const usuarioEliminado = usuariosData[usuarioIndex];
        usuariosData.splice(usuarioIndex, 1);
        
        console.log(`✅ Usuario eliminado: ${usuarioEliminado.nombre}`);
        console.log(`📊 Total usuarios: ${usuariosData.length}`);
        return `Usuario con ID ${id} (${usuarioEliminado.nombre}) eliminado correctamente`;
    }
};

// 4. CONFIGURACIÓN DEL SERVIDOR
const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

// 5. INICIAR SERVIDOR
const PORT = 4000;
app.listen(PORT, () => {
    console.log('========================================');
    console.log('✅ SERVIDOR GRAPHQL - NIVEL 3');
    console.log('========================================');
    console.log(`📝 Abre http://localhost:${PORT}/graphql`);
    console.log('========================================');
    console.log('📋 OPERACIONES DISPONIBLES:');
    console.log('');
    console.log('🔹 QUERIES (Lectura):');
    console.log('   • usuarios - Listar todos');
    console.log('   • usuario(id: Int!) - Buscar por ID');
    console.log('');
    console.log('🔸 MUTATIONS (Escritura):');
    console.log('   • crearUsuario(nombre: String!, correo: String!)');
    console.log('   • actualizarUsuario(id: Int!, nombre: String, correo: String)');
    console.log('   • eliminarUsuario(id: Int!)');
    console.log('========================================');
    console.log(`👥 ${usuariosData.length} usuarios en memoria`);
    console.log('========================================');
});