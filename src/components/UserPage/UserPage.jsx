import React, {useState} from 'react';
import LogOutButton from '../LogOutButton/LogOutButton';
import {useSelector} from 'react-redux';
import './UserPage.css'; 


function UserPage() {
  const user = useSelector((store) => store.user);
  
  const [isFormVisible, setFormVisible] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [children, setChildren] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    photo: null
  });

  const handleAddChildClick = () => {
    setEditing(false);
    setEditingIndex(null);
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      photo: null
    });
    setFormVisible(true);
  };

  const handleEditChildClick = (index) => {
    setEditing(true);
    setEditingIndex(index);
    setFormData(children[index]);
    setFormVisible(true);
  };

  const handleDeleteChildClick = (index) => {
    if (window.confirm('Are you sure you want to delete this child?')) {
      const updatedChildren = children.filter((_, i) => i !== index);
      setChildren(updatedChildren);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'photo' ? files[0] : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.dateOfBirth && formData.gender) {
      if (isEditing && editingIndex !== null) {
        const updatedChildren = [...children];
        updatedChildren[editingIndex] = formData;
        setChildren(updatedChildren);
      } else {
        setChildren(prevChildren => [...prevChildren, formData]);
      }
      setFormData({ name: '', dateOfBirth: '', gender: '', photo: null });
      setFormVisible(false);
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setEditing(false);
  };

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p>
      <br />
      <br />
      <button type="button" onClick={handleAddChildClick}>
        {isEditing ? 'Edit Child/Children' : 'Add Child/Children'}
      </button>

      {isFormVisible && (
        <form onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleFormChange}
              required
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Photo:
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFormChange}
            />
          </label>
          <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      )}

      <div className="children-list">
        {children.map((child, index) => (
          <div key={index} className="child-item">
            <div className="child-photo">
              {child.photo ? (
                <img src={URL.createObjectURL(child.photo)} alt={child.name} />
              ) : (
                <div className="placeholder-icon">+</div>
              )}
            </div>
            <p>Name: {child.name}</p>
            <p>Date of Birth: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
            <p>Gender: {child.gender}</p>
            <button type="button" onClick={() => handleEditChildClick(index)}>Edit</button>
            <button type="button" onClick={() => handleDeleteChildClick(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPage;