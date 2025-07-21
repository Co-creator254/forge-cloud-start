import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Animal {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  acquisition_date?: string;
  status?: string;
}

const AnimalManagement: React.FC<{ userId: string }> = ({ userId }) => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<Animal>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, [userId]);

  async function fetchAnimals() {
    setLoading(true);
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('user_id', userId);
    if (!error) setAnimals(data || []);
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    if (editingId) {
      await supabase.from('animals').update(form).eq('id', editingId);
    } else {
      await supabase.from('animals').insert({ ...form, user_id: userId });
    }
    setForm({});
    setEditingId(null);
    fetchAnimals();
  }

  async function handleDelete(id: string) {
    setLoading(true);
    await supabase.from('animals').delete().eq('id', id);
    fetchAnimals();
  }

  function startEdit(animal: Animal) {
    setForm(animal);
    setEditingId(animal.id);
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Animal Management</h2>
      <form className="mb-4 grid grid-cols-2 gap-2" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <input className="border p-2 rounded" placeholder="Name" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Species" value={form.species || ''} onChange={e => setForm(f => ({ ...f, species: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Breed" value={form.breed || ''} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} />
        <input className="border p-2 rounded" type="date" placeholder="Birth Date" value={form.birth_date || ''} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} />
        <input className="border p-2 rounded" type="date" placeholder="Acquisition Date" value={form.acquisition_date || ''} onChange={e => setForm(f => ({ ...f, acquisition_date: e.target.value }))} />
        <select className="border p-2 rounded" value={form.status || 'active'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="deceased">Deceased</option>
        </select>
        <Button type="submit" className="col-span-2">{editingId ? 'Update' : 'Add'} Animal</Button>
      </form>
      {loading && <div>Loading...</div>}
      <div className="space-y-2">
        {animals.map(animal => (
          <Card key={animal.id} className="p-2 flex justify-between items-center">
            <CardContent>
              <div className="font-bold">{animal.name} ({animal.species})</div>
              <div className="text-xs text-gray-500">Breed: {animal.breed || 'N/A'} | Status: {animal.status}</div>
              <div className="text-xs text-gray-500">Birth: {animal.birth_date || 'N/A'} | Acquired: {animal.acquisition_date || 'N/A'}</div>
            </CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(animal)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(animal.id)}>Delete</Button>
            </div>
          </Card>
        ))}
        {animals.length === 0 && !loading && <div className="text-gray-500">No animals found.</div>}
      </div>
    </div>
  );
};

export default AnimalManagement;
