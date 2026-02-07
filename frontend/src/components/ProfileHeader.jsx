import { useEffect, useState } from "react";
import api from "../axios";
import "../Styles/ProfileHeader.css";

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    api
      .get("/users/me", { headers: authHeaders })
      .then((res) => {
        setUser(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load profile");
      });
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      setUploading(true);
      const res = await api.put("/users/profile-photo", formData, {
        headers: authHeaders,
      });
      setUser(res.data.user || res.data);
    } catch (err) {
      console.error(err);
      alert("Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const displayName = user?.username || "User";
  const displayEmail = user?.email || "user@example.com";
  const profilePhoto =
    user?.profilePhoto ||
    "https://res.cloudinary.com/djb9dz0cb/image/upload/v1770327023/default_Profile_xvcnsw.jpg";

  return (
    <div className="profile-header">
      <div className="profile-photo">
        <img src={profilePhoto} alt="Profile" />
      </div>

      <div className="profile-info">
        <h3>{displayName}</h3>
        <span>@{displayEmail.split("@")[0]}</span>
        {!user && <small>Loading profile...</small>}
        {error && <small className="profile-error">{error}</small>}
        {uploading && <small>Uploading...</small>}
      </div>

      <label className="update-btn">
        Update Photo
        <input type="file" hidden onChange={handlePhotoChange} />
      </label>
    </div>
  );
};

export default ProfileHeader;
