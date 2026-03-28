import React from 'react';
import { FamilyMember } from '../state/features/family/familySlice';

interface MemberCardProps {
  member: FamilyMember;
  onEdit: () => void;
  onDelete: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete }) => {
  return (
    <div className="member-card">
      <div className="member-header">
        {member.profileImage ? (
          <img src={member.profileImage} alt={member.name} className="member-avatar" />
        ) : (
          <div className="member-avatar-placeholder">
            {member.name.charAt(0)}
          </div>
        )}
        <div className="member-role-badge">{member.role}</div>
      </div>
      <div className="member-info">
        <h3>{member.name}</h3>
        <p className="relationship">{member.relationship}</p>
        <p className="email">{member.email}</p>
        {member.phone && <p className="phone">{member.phone}</p>}
        <p className="dob">DOB: {new Date(member.dateOfBirth).toLocaleDateString()}</p>
      </div>
      <div className="member-actions">
        <button className="btn btn-sm btn-primary" onClick={onEdit}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
