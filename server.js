const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('Connexion à MongoDB réussie'))
 .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Définition du modèle User
const userSchema = new mongoose.Schema({
 username: { type: String, required: true },
 password: { type: String, required: true },
 role: ["docteur","rh","administrateur"] 
});


const patientSchema = new mongoose.Schema({

  nom: { type: String, required: true },

  prenom: { type: String, required: true },

  age: { type: Number, required: true },

  poids: { type: Number, required: true },

  taille: { type: Number, required: true },

  traitementEnCours: { type: [String], required: true }

});


const Patient = mongoose.model('Patient', patientSchema);

const User = mongoose.model('User', userSchema);

const app = express();
app.use(express.json());

// Middleware pour vérifier l'authentification avec le token
function authenticateToken(req, res, next) {
 const token = req.headers['authorization'];
 if (token == null) {
   return res.sendStatus(401);
 }

 jwt.verify(token, 'secret', (err, user) => {
   if (err) {
     return res.sendStatus(403);
   }
   req.user = user;
   next();
 });
}

// Route pour la création d'un compte utilisateur
app.post('/api/register', async (req, res) => {
 try {
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
   const user = new User({
     username: req.body.username,
     password: hashedPassword,
     role: req.body.role
   });
   await user.save();
   res.sendStatus(201);
 } catch (err) {
   res.status(500).send(err);
 }
});

// Route pour l'authentification et la génération du token
app.post('/api/login', async (req, res) => {
    console.log("test")
 try {

   const user = await User.findOne({ username: req.body.username });
   if (!user) {
     return res.status(404).send('Utilisateur non trouvé');
   }

   const passwordMatch = await bcrypt.compare(req.body.password, user.password);
   if (!passwordMatch) {
     return res.status(401).send('Mot de passe incorrect');
   }

   const token = jwt.sign({ username: user.username, role: user.role }, 'secret');
   console.log(user.role)
   let = roleR = ""
   if(user.role === "docteur"){
    roleR = "poqspdqms"
   }
   else if (user.role === "administrateur"){
    roleR = "azeaezaea"
   }
   else{
    roleR = "123543454"
   }
   res.json({'token': token, 'chemin': roleR });
 } catch (err) {
   res.status(500).send(err);
 }
});

// Exemple de route pour une page docteur accessible uniquement aux utilisateurs avec le rôle "docteur"
app.get('/api/docteur', authenticateToken, (req, res) => {
 if (req.user.role !== 'docteur') {
   return res.sendStatus(403);
 }
 res.send('Page docteur');
});

// Exemple de route pour une page administrateur accessible uniquement aux utilisateurs avec le rôle "administrateur"
app.get('/api/administrateur', authenticateToken, (req, res) => {
 if (req.user.role !== 'administrateur') {
   return res.sendStatus(403);
 }
 res.send('Page administrateur');
});

// Exemple de route pour une page RH accessible uniquement aux utilisateurs avec le rôle "RH"
app.get('/api/rh', authenticateToken, (req, res) => {
 if (req.user.role !== 'rh') {
   return res.sendStatus(403);
 }
 res.send('Page RH');
});

// Exemple de route pour la modification d'un médecin accessible uniquement aux utilisateurs avec le rôle "administrateur"
app.put('/api/medecin/:id', authenticateToken, (req, res) => {
 if (req.user.role !== 'administrateur') {
   return res.sendStatus(403);
 }
 // Logique de modification du médecin
 res.send('Modification du médecin');
});

// Exemple de route pour la suppression d'un médecin accessible uniquement aux utilisateurs avec le rôle "administrateur"
app.delete('/api/medecin/:id', authenticateToken, (req, res) => {
 if (req.user.role !== 'administrateur') {
   return res.sendStatus(403);
 }
 // Logique de suppression du médecin
 res.send('Suppression du médecin');
});

// Exemple de route pour la modification d'un RH accessible uniquement aux utilisateurs avec le rôle "administrateur"
app.put('/api/rh/:id', authenticateToken, (req, res) => {
 if (req.user.role !== 'administrateur') {
   return res.sendStatus(403);
 }
 // Logique de modification du RH
 res.send('Modification du RH');
});

// Exemple de route pour la suppression d'un RH accessible uniquement aux utilisateurs avec le rôle "administrateur"
app.delete('/api/rh/:id', authenticateToken, (req, res) => {
 if (req.user.role !== 'administrateur') {
   return res.sendStatus(403);
 }
 // Logique de suppression du RH
 res.send('Suppression du RH');
});

// Exemple de route pour la création d'un patient accessible uniquement aux utilisateurs avec le rôle "RH"
app.post('/api/patient', authenticateToken, async (req, res) => {
    if (req.user.role !== 'rh') {
      return res.sendStatus(403);
    }
   
    try {
      const { nom, prenom, age, poids, taille, traitementEnCours } = req.body;
   
      // Création d'une instance du modèle Patient
      const patient = new Patient({
        nom,
        prenom,
        age,
        poids,
        taille,
        traitementEnCours
      });
   
      // Enregistrement du patient dans la collection "patients"
      await patient.save();
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err);
    }
   });

// Exemple de route pour la modification d'un traitement accessible uniquement aux utilisateurs avec le rôle "docteur"
app.put('/api/traitement/:id', authenticateToken, (req, res) => {
 if (req.user.role !== 'docteur') {
   return res.sendStatus(403);
 }
 // Logique de modification du traitement
 res.send('Modification du traitement');
});

// Exemple de route pour l'envoi de messages à un patient accessible uniquement aux utilisateurs avec le rôle "docteur"
app.post('/api/message/:patientId', authenticateToken, (req, res) => {
 if (req.user.role !== 'docteur') {
   return res.sendStatus(403);
 }
 // Logique d'envoi du message
 res.send('Envoi du message');
});

// Exemple de route pour la prise de rendez-vous accessible uniquement aux utilisateurs avec le rôle "docteur"
app.post('/api/rendezvous/:patientId', authenticateToken, (req, res) => {
 if (req.user.role !== 'docteur') {
   return res.sendStatus(403);
 }
 // Logique de prise de rendez-vous
 res.send('Prise de rendez-vous');
});

// Démarrer le serveur
app.listen(3000, () => {
 console.log('Serveur démarré sur le port 3000');
});