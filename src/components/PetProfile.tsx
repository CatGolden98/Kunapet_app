import React, { useState } from 'react';
import { ArrowLeft, Plus, Heart, Camera, Calendar, FileText } from 'lucide-react';
import { AppContextType, Pet } from '../App';

interface PetProfileProps {
  context: AppContextType;
}

const PetProfile: React.FC<PetProfileProps> = ({ context }) => {
  const [activeTab, setActiveTab] = useState<'pets' | 'add'>('pets');
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'other',
    age: '',
    breed: '',
    medicalHistory: ''
  });

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    const pet: Pet = {
      id: Date.now().toString(),
      ...newPet,
    };
    context.setPets([...context.pets, pet]);
    setNewPet({
      name: '',
      species: 'dog',
      age: '',
      breed: '',
      medicalHistory: ''
    });
    setActiveTab('pets');
  };

  const speciesEmojis = {
    dog: '🐕',
    cat: '🐱',
    other: '🐾'
  };

  return (
    <div className="screen-container bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => context.setCurrentScreen('home')}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Mis Mascotas</h1>
        <button 
          onClick={() => setActiveTab('add')}
          className="p-2 rounded-full bg-primary-100"
        >
          <Plus className="w-6 h-6 text-primary-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 py-4 border-b">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pets')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'pets'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Mis Mascotas ({context.pets.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'add'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Agregar Nueva
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6">
        {activeTab === 'pets' ? (
          <div className="space-y-4">
            {context.pets.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No hay mascotas registradas
                </h3>
                <p className="text-gray-500 mb-6">
                  Agrega tu primera mascota para comenzar
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Mascota
                </button>
              </div>
            ) : (
              context.pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mr-4">
                      <span className="text-3xl">{speciesEmojis[pet.species]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{pet.name}</h3>
                      <p className="text-gray-500 capitalize">{pet.species} • {pet.breed}</p>
                      <p className="text-gray-400 text-sm">{pet.age}</p>
                    </div>
                  </div>
                  
                  {pet.medicalHistory && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Historial Médico</span>
                      </div>
                      <p className="text-sm text-gray-600">{pet.medicalHistory}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Agregar Nueva Mascota
            </h2>
            
            <form onSubmit={handleAddPet} className="space-y-6">
              {/* Photo Upload */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <button type="button" className="text-primary-600 font-medium">
                  Subir Foto
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la mascota
                </label>
                <input
                  type="text"
                  value={newPet.name}
                  onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                  className="input-field"
                  placeholder="Ej: Max, Bella, Firulais"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de mascota
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(speciesEmojis).map(([species, emoji]) => (
                    <button
                      key={species}
                      type="button"
                      onClick={() => setNewPet({...newPet, species: species as any})}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                        newPet.species === species
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-1">{emoji}</span>
                      <span className="text-xs capitalize">{species === 'other' ? 'Otro' : species}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad
                  </label>
                  <input
                    type="text"
                    value={newPet.age}
                    onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                    className="input-field"
                    placeholder="Ej: 2 años"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raza
                  </label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                    className="input-field"
                    placeholder="Ej: Labrador"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Historial médico (opcional)
                </label>
                <textarea
                  value={newPet.medicalHistory}
                  onChange={(e) => setNewPet({...newPet, medicalHistory: e.target.value})}
                  className="input-field h-24 resize-none"
                  placeholder="Vacunas, alergias, medicamentos, etc."
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Agregar Mascota
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;