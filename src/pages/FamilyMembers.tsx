import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks/hook';
import type { RootState } from '../state/store/store';
import {
  fetchFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  FamilyMember,
} from '../state/features/family/familySlice';
import MemberForm from '../components/forms/MemberForm';
import MemberCard from '../components/MemberCard';

const FamilyMembers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { members, loading, error } = useAppSelector((state: RootState) => state.family);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [filterRole, setFilterRole] = useState<'All' | 'Admin' | 'Member' | 'Viewer'>('All');

  useEffect(() => {
    dispatch(fetchFamilyMembers() as any);
  }, [dispatch]);

  const handleAddMember = async (memberData: Omit<FamilyMember, 'id'>) => {
    try {
      await dispatch(addFamilyMember(memberData) as any).unwrap();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  const handleUpdateMember = async (memberData: FamilyMember) => {
    try {
      await dispatch(updateFamilyMember(memberData) as any).unwrap();
      setEditingMember(null);
    } catch (err) {
      console.error('Error updating member:', err);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await dispatch(deleteFamilyMember(id) as any).unwrap();
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  const filteredMembers =
    filterRole === 'All' ? members : members.filter((m: any) => m.role === filterRole);

  return (
    <div className="family-members-container">
      <div className="page-header">
        <h1>Family Members</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <MemberForm
            onSubmit={handleAddMember}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingMember && (
        <div className="form-container">
          <h2>Edit Member</h2>
          <MemberForm
            initialData={editingMember}
            onSubmit={(data) => handleUpdateMember({ ...data, id: editingMember.id })}
            onCancel={() => setEditingMember(null)}
          />
        </div>
      )}

      <div className="filter-section">
        <label>Filter by Role:</label>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading members...</div>
      ) : (
        <div className="members-grid">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member: any) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={() => setEditingMember(member)}
                onDelete={() => handleDeleteMember(member.id)}
              />
            ))
          ) : (
            <div className="no-data">No family members found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyMembers;
