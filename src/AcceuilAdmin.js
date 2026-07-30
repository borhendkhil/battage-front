import React, { useState, useEffect } from 'react';
import { API_URL } from "./config";
import './App.css';
import './AcceuilAdmin.css';
import Navbar from './Navbar';
import bg from './assets/bg-img.jpg';
import ParcelleSection from './ParcelleSection';
import UtilisateurSection from './UtilisateurSection';
import AgroSection from './AgroSection';
import CategorieCultureSection from './CategorieCultureSection';
import TypeCultureSection from './TypeCultureSection';
import NatureCultureSection from './NatureCultureSection';
import ProductionSection from './ProductionSection';
import CampagneSection from './CampagneSection';
import AffectationCultureSection from './AffectationCultureSection';
import AffectationAgentSection from './AffectationAgentSection';

export default function AcceuilAdmin() {
  const [selectedSection, setSelectedSection] = useState('users');
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [agroCombinats, setAgroCombinats] = useState([]);
  const [parcelles, setParcelles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [showAddCategorieModal, setShowAddCategorieModal] = useState(false);
  const [showEditCategorieModal, setShowEditCategorieModal] = useState(false);
  const [newCategorie, setNewCategorie] = useState({ libelle: '' });
  const [editCategorie, setEditCategorie] = useState({ id: '', libelle: '' });
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showEditTypeModal, setShowEditTypeModal] = useState(false);
  const [newType, setNewType] = useState({ libelle: '', categorie_id: '' });
  const [editType, setEditType] = useState({ id: '', libelle: '', categorie_id: '' });
  // Ajoutez ici tous les états nécessaires pour les modals, formulaires, etc.

  // Exemples d'états pour les modals utilisateurs
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
  const [editUser, setEditUser] = useState({ id: '', username: '', password: '', role: '' });

  // Etats pour les modals agro_combinats
  const [showAddAgroModal, setShowAddAgroModal] = useState(false);
  const [showEditAgroModal, setShowEditAgroModal] = useState(false);
  const [newAgro, setNewAgro] = useState({ COD_SOC: '', LIB_SOC: '' });
  const [editAgro, setEditAgro] = useState({ COD_SOC: '', LIB_SOC: '' });

  // Etats pour les modals parcelles
  const [showAddParcelleModal, setShowAddParcelleModal] = useState(false);
  const [newParcelle, setNewParcelle] = useState({ COD_SOC: '', cod_par: '', lib_par: '', surface: '' });
  const [showEditParcelleModal, setShowEditParcelleModal] = useState(false);
  const [editParcelle, setEditParcelle] = useState({ COD_SOC: '', cod_par: '', lib_par: '', surface: '' });

  // Fetch des données au chargement
  useEffect(() => {
    fetch(API_URL + '/utilisateurs').then(r => r.json()).then(setUtilisateurs);
    fetch(API_URL + '/agro-combinats').then(r => r.json()).then(setAgroCombinats);
    // fetch(API_URL + '/cereales').then(r => r.json()).then(setCereales);
    // fetch(API_URL + '/foins').then(r => r.json()).then(setFoins);
    // fetch(API_URL + '/legumineuses').then(r => r.json()).then(setLegumineuses);
    fetch(API_URL + '/parcelles').then(r => r.json()).then(setParcelles);
    fetch(API_URL + '/categorie-culture')
      .then(r => r.json())
      .then(setCategories);
    fetch(API_URL + '/type-culture')
      .then(r => r.json())
      .then(setTypes);
  }, []);

  const adminStats = [
    { label: 'Utilisateurs', value: utilisateurs.length, icon: '👥' },
    { label: 'Exploitations', value: agroCombinats.length, icon: '🏭' },
    { label: 'Parcelles', value: parcelles.length, icon: '🌾' },
    { label: 'Catégories', value: categories.length, icon: '📂' },
    { label: 'Types', value: types.length, icon: '🏷️' }
  ];

  // Ajoutez ce useEffect pour recharger la liste à chaque sélection de la section "users"
  useEffect(() => {
    if (selectedSection === 'users') {
      fetch(API_URL + '/utilisateurs').then(r => r.json()).then(setUtilisateurs);
    }
    // Ajout : recharger les affectations culture si section sélectionnée
    if (selectedSection === 'affectation-culture') {
      // Optionnel : vous pouvez ajouter un état pour forcer le rechargement si besoin
    }
  }, [selectedSection]);

  // Navigation entre sections
  const showSection = (section, e) => {
    e.preventDefault();
    setSelectedSection(section);
  };

  // Gestion utilisateurs (exemple pour l'ajout)
  const openAddUserModal = () => setShowAddUserModal(true);
  const closeAddUserModal = () => setShowAddUserModal(false);
  const submitAddUser = async (e) => {
    e.preventDefault();
    await fetch(API_URL + '/utilisateurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    setShowAddUserModal(false);
    setNewUser({ username: '', password: '', role: '' });
    fetch(API_URL + '/utilisateurs').then(r => r.json()).then(setUtilisateurs);
  };

  // Ouvre la modal d'édition avec les infos de l'utilisateur sélectionné
  const openEditUserModal = (user) => {
    setEditUser(user);
    setShowEditUserModal(true);
  };
  const closeEditUserModal = () => setShowEditUserModal(false);

  // Soumet la modification
  const submitEditUser = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/utilisateurs/${editUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUser)
    });
    setShowEditUserModal(false);
    fetch(API_URL + '/utilisateurs').then(r => r.json()).then(setUtilisateurs);
  };

  // Supprime un utilisateur
  const deleteUser = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      await fetch(`${API_URL}/utilisateurs/${id}`, { method: 'DELETE' });
      fetch(API_URL + '/utilisateurs').then(r => r.json()).then(setUtilisateurs);
    }
  };

  // Ouvre la modal d'ajout
  const openAddAgroModal = () => {
    setNewAgro({ COD_SOC: '', LIB_SOC: '' });
    setShowAddAgroModal(true);
  };
  const closeAddAgroModal = () => {
    setShowAddAgroModal(false);
    setNewAgro({ COD_SOC: '', LIB_SOC: '' });
  };

  // Ajout d'un agro_combinat
  const submitAddAgro = async (e) => {
    e.preventDefault();
    if (!newAgro.COD_SOC || !newAgro.LIB_SOC) return;
   
    const res = await fetch(API_URL + '/agro-combinats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        COD_SOC: newAgro.COD_SOC,
        LIB_SOC: newAgro.LIB_SOC 
      })
    });
    if (res.ok) {
      setShowAddAgroModal(false);
      setNewAgro({ COD_SOC: '', LIB_SOC: '' });
      fetch(API_URL + '/agro-combinats').then(r => r.json()).then(setAgroCombinats);
    }
  };

  // Ouvre la modal d'édition
  const openEditAgroModal = (agro) => {
    setEditAgro({ ...agro }); 
    setShowEditAgroModal(true);
  };
  const closeEditAgroModal = () => {
    setShowEditAgroModal(false);
    setEditAgro({ COD_SOC: '', LIB_SOC: '' });
  };

  // Modification d'un agro_combinat
  const submitEditAgro = async (e) => {
    e.preventDefault();
    if (!editAgro.COD_SOC || !editAgro.LIB_SOC) return;
   
    const res = await fetch(`${API_URL}/agro-combinats/${editAgro.COD_SOC}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ LIB_SOC: editAgro.LIB_SOC }) 
    });
    if (res.ok) {
      setShowEditAgroModal(false);
      setEditAgro({ COD_SOC: '', LIB_SOC: '' });
      fetch(API_URL + '/agro-combinats').then(r => r.json()).then(setAgroCombinats);
    }
  };

  // Suppression d'un agro_combinat
  const deleteAgro = async (COD_SOC) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette exploitation agricole ?')) {
      await fetch(`${API_URL}/agro-combinats/${COD_SOC}`, { method: 'DELETE' });
      fetch(API_URL + '/agro-combinats').then (r => r.json()).then(setAgroCombinats);
    }
  };

  // Ouvre la modal d'ajout
  const openAddParcelleModal = () => {
    setNewParcelle({ COD_SOC: '', cod_par: '', lib_par: '', surface: '' });
    setShowAddParcelleModal(true);
  };
  const closeAddParcelleModal = () => setShowAddParcelleModal(false);

  // Ajoutez cette fonction si elle n'existe pas déjà :
  const submitAddParcelle = async (e) => {
    e.preventDefault();
    // Chercher le max cod_par pour le COD_SOC sélectionné
    const res = await fetch(`${API_URL}/parcelles?COD_SOC=${encodeURIComponent(newParcelle.COD_SOC)}`);
    const parcellesAgro = await res.json();
    let maxCodPar = 0;
    parcellesAgro.forEach(p => {
      const val = parseInt(p.cod_par, 10);
      if (!isNaN(val) && val > maxCodPar) maxCodPar = val;
    });
    const nextCodPar = maxCodPar + 1;

    // Insertion avec le nouveau cod_par
    await fetch(API_URL + '/parcelles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newParcelle,
        cod_par: nextCodPar
      })
    });
    setShowAddParcelleModal(false);
    setNewParcelle({ COD_SOC: '', cod_par: '', lib_par: '', surface: '' });
    fetch(API_URL + '/parcelles').then(r => r.json()).then(setParcelles);
  };

  // Ouvre la modal d'édition
  const openEditParcelleModal = (parcelle) => {
    setEditParcelle(parcelle);
    setShowEditParcelleModal(true);
  };

  // Ferme la modal d'édition de parcelle
  const closeEditParcelleModal = () => setShowEditParcelleModal(false);

  // Suppression d'une parcelle
  const deleteParcelle = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette parcelle ?')) {
      await fetch(`${API_URL}/parcelles/${id}`, { method: 'DELETE' });
      fetch(API_URL + '/parcelles').then(r => r.json()).then(setParcelles);
    }
  };

  // Categorie-culture CRUD
  const openAddCategorieModal = () => setShowAddCategorieModal(true);
  const closeAddCategorieModal = () => setShowEditCategorieModal(false);
  const submitAddCategorie = async (e) => {
    e.preventDefault();
    await fetch(API_URL + '/categorie-culture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategorie)
    });
    setShowAddCategorieModal(false);
    setNewCategorie({ libelle: '' });
    fetch(API_URL + '/categorie-culture').then(r => r.json()).then(setCategories);
  };
  const openEditCategorieModal = (cat) => {
    setEditCategorie(cat);
    setShowEditCategorieModal(true);
  };
  const closeEditCategorieModal = () => setShowEditCategorieModal(false);
  const submitEditCategorie = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/categorie-culture/${editCategorie.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCategorie)
    });
    setShowEditCategorieModal(false);
    fetch(API_URL + '/categorie-culture').then(r => r.json()).then(setCategories);
  };
  const deleteCategorie = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette catégorie agricole ?')) {
      await fetch(`${API_URL}/categorie-culture/${id}`, { method: 'DELETE' });
      fetch(API_URL + '/categorie-culture').then(r => r.json()).then(setCategories);
    }
  };

  // Type-culture CRUD
  const openAddTypeModal = () => setShowAddTypeModal(true);
  const closeAddTypeModal = () => setShowAddTypeModal(false);
  const submitAddType = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL + '/type-culture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newType)
      });
      
      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        const err = await res.text();
        alert('Erreur lors de l\'ajout: ' + err);
        return;
      }
      if (!contentType || contentType.indexOf('application/json') === -1) {
        alert(
          "Erreur critique : le backend Node.js n'a pas répondu sur /type-culture.\n" +
          "Vous avez reçu une page HTML (probablement le frontend React).\n" +
          "Vérifiez que votre backend Node.js écoute bien sur le port 3000 et que le proxy ou l'URL d'appel est correcte."
        );
        return;
      }
      await res.json();
      setShowAddTypeModal(false);
      setNewType({ libelle: '', categorie_id: '' });
      fetch(API_URL + '/type-culture').then(r => r.json()).then(setTypes);
    } catch (err) {
      alert('Erreur réseau lors de l\'ajout du type-culture');
    }
  };
  const openEditTypeModal = (type) => {
    setEditType(type);
    setShowEditTypeModal(true);
  };
  const closeEditTypeModal = () => setShowEditTypeModal(false);
  const submitEditType = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/type-culture/${editType.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editType)
    });
    setShowEditTypeModal(false);
    fetch(API_URL + '/type-culture').then(r => r.json()).then(setTypes);
  };
  const deleteType = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce type agricole ?')) {
      await fetch(`${API_URL}/type-culture/${id}`, { method: 'DELETE' });
      fetch(API_URL + '/type-culture').then(r => r.json()).then(setTypes);
    }
  };

  // Ajoutez la fonction submitEditParcelle pour corriger l'erreur
  const submitEditParcelle = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/parcelles/${editParcelle.COD_SOC}/${editParcelle.cod_par}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lib_par: editParcelle.lib_par,
        surface: editParcelle.surface
      })
    });
    setShowEditParcelleModal(false);
    setEditParcelle({ COD_SOC: '', cod_par: '', lib_par: '', surface: '' });
    fetch(API_URL + '/parcelles').then(r => r.json()).then(setParcelles);
  };

  return (
    <div className="background_wrapper" style={{
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <div className="contenu">
        <Navbar handleNavClick={showSection} />

        <div className="dashboard-panel">
          <div className="dashboard-cards">
            {adminStats.map((item) => (
              <div key={item.label} className="stat-card">
                <div className="stat-icon">{item.icon}</div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {selectedSection === 'users' && (
          <div className="bienvenue" >
            <span>Bienvenue dans le système de battage</span>
          </div>
        )}
        {selectedSection === 'agro' && (
          <AgroSection
            agroCombinats={agroCombinats}
            showAddAgroModal={showAddAgroModal}
            openAddAgroModal={openAddAgroModal}
            closeAddAgroModal={closeAddAgroModal}
            submitAddAgro={submitAddAgro}
            newAgro={newAgro}
            setNewAgro={setNewAgro}
            showEditAgroModal={showEditAgroModal}
            openEditAgroModal={openEditAgroModal}
            closeEditAgroModal={closeEditAgroModal}
            submitEditAgro={submitEditAgro}
            editAgro={editAgro}
            setEditAgro={setEditAgro}
            deleteAgro={deleteAgro}
          />
        )}
        {selectedSection === 'parcelle' && (
          <ParcelleSection
            agroCombinats={agroCombinats}
            parcelles={parcelles}
            showAddParcelleModal={showAddParcelleModal}
            openAddParcelleModal={openAddParcelleModal}
            closeAddParcelleModal={closeAddParcelleModal}
            submitAddParcelle={submitAddParcelle}
            newParcelle={newParcelle}
            setNewParcelle={setNewParcelle}
            openEditParcelleModal={openEditParcelleModal}
            deleteParcelle={deleteParcelle}
          />
        )}
        {/* Modal d'édition de parcelle */}
        {showEditParcelleModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Modifier la parcelle</h3>
              <form onSubmit={submitEditParcelle}>
                <div className="form-group">
                  <label>Exploitation Agricole</label>
                  <input
                    type="text"
                    className="login__input"
                    value={editParcelle.COD_SOC}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Code Parcelle</label>
                  <input
                    type="text"
                    className="login__input"
                    value={editParcelle.cod_par}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Nom de la parcelle</label>
                  <input
                    type="text"
                    className="login__input"
                    value={editParcelle.lib_par}
                    onChange={e => setEditParcelle({ ...editParcelle, lib_par: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Surface</label>
                  <input
                    type="number"
                    className="login__input"
                    value={editParcelle.surface}
                    onChange={e => setEditParcelle({ ...editParcelle, surface: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="add-btn">Confirmer</button>
                  <button type="button" className="delete-btn" onClick={closeEditParcelleModal}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {selectedSection === 'categorie-culture' && (
          <CategorieCultureSection
            categories={categories}
            showAddCategorieModal={showAddCategorieModal}
            openAddCategorieModal={openAddCategorieModal}
            closeAddCategorieModal={closeAddCategorieModal}
            submitAddCategorie={submitAddCategorie}
            newCategorie={newCategorie}
            setNewCategorie={setNewCategorie}
            showEditCategorieModal={showEditCategorieModal}
            openEditCategorieModal={openEditCategorieModal}
            closeEditCategorieModal={closeEditCategorieModal}
            submitEditCategorie={submitEditCategorie}
            editCategorie={editCategorie}
            setEditCategorie={setEditCategorie}
            deleteCategorie={deleteCategorie}
          />
        )}
        {selectedSection === 'type-culture' && (
          <TypeCultureSection
            types={types}
            categories={categories}
            showAddTypeModal={showAddTypeModal}
            openAddTypeModal={openAddTypeModal}
            closeAddTypeModal={closeAddTypeModal}
            submitAddType={submitAddType}
            newType={newType}
            setNewType={setNewType}
            showEditTypeModal={showEditTypeModal}
            openEditTypeModal={openEditTypeModal}
            closeEditTypeModal={closeEditTypeModal}
            submitEditType={submitEditType}
            editType={editType}
            setEditType={setEditType}
            deleteType={deleteType}
          />
        )}
        {selectedSection === 'nature-culture' && (
          <NatureCultureSection />
        )}
        {selectedSection === 'production' && (
          <ProductionSection />
        )}
        {selectedSection === 'campagne' && (
          <CampagneSection />
        )}
        {selectedSection === 'affectation-culture' && (
          <AffectationCultureSection />
        )}
        {selectedSection === 'affectation-agent' && (
          <AffectationAgentSection />
        )}
      </div>
    </div>
  );
}
