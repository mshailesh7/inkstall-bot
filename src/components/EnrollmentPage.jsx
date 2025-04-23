import React, { useState, useEffect } from "react";
import { Country, State, City } from 'country-state-city';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnrollmentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dob: "",
    institution: "",
    board: "",
    classLevel: "",
    gender: "",
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load countries on component mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, [navigate]);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    } else {
      setStates([]);
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      setCities(City.getCitiesOfState(formData.country, formData.state));
    } else {
      setCities([]);
    }
  }, [formData.country, formData.state]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData({ ...formData, country: value, state: "", city: "" });
    } else if (name === "state") {
      setFormData({ ...formData, state: value, city: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.board) newErrors.board = "Board is required";
    if (!formData.classLevel) newErrors.classLevel = "Class is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.institution) newErrors.institution = "Institution name is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setApiError("");
      
      try {
        // Get user data from session storage
        const userData = JSON.parse(sessionStorage.getItem('user'));
        
        // Try to get userId from different possible sources
        let userId = null;
        
        // Check if we have user data with id
        if (userData && (userData.id || userData._id)) {
          userId = userData.id || userData._id;
        }
        
        // If no userId found, try to extract from token payload
        if (!userId) {
          const tokenData = JSON.parse(sessionStorage.getItem('token'));
          if (tokenData && tokenData.value) {
            try {
              // JWT tokens are in format: header.payload.signature
              // We need to decode the payload (second part)
              const tokenParts = tokenData.value.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                userId = payload.id || payload.sub || payload.userId || payload._id;
              }
            } catch (error) {
              console.error('Error decoding token:', error);
            }
          }
        }
        
        // If still no userId, check URL parameters
        if (!userId) {
          const urlParams = new URLSearchParams(window.location.search);
          const urlUserId = urlParams.get('userId');
          if (urlUserId) {
            userId = urlUserId;
          }
        }
        
        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }
        
        console.log('Using userId for enrollment:', userId);
        
        // Get token from session storage
        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const token = tokenData?.value;
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        // Make API call to enrollment endpoint
        const response = await axios.post(`/api/enroll?userId=${userId}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log("Enrollment successful:", response.data);
        setSuccess(true);
        
        // Update user data in session storage to reflect enrollment
        let updatedUserData = userData || {};
        updatedUserData.isEnrolled = true;
        sessionStorage.setItem('user', JSON.stringify(updatedUserData));
        
        // Update enrollment status in session storage
        sessionStorage.setItem('isEnrolled', JSON.stringify(true));
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } catch (err) {
        console.error("Enrollment error:", err);
        setApiError(err.response?.data?.message || err.message || "Enrollment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Enrollment Form</h2>
        
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {apiError}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Enrollment successful! Redirecting to dashboard...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Date of Birth */}
          <div>
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="w-full border rounded px-3 py-2"
              value={formData.dob}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>

          {/* Board */}
          <div>
            <label className="block font-medium mb-1">Board</label>
            <input
              type="text"
              name="board"
              className="w-full border rounded px-3 py-2"
              value={formData.board}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.board && <p className="text-red-500 text-sm">{errors.board}</p>}
          </div>

          {/* Class */}
          <div>
            <label className="block font-medium mb-1">Class</label>
            <input
              type="text"
              name="classLevel"
              className="w-full border rounded px-3 py-2"
              value={formData.classLevel}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.classLevel && <p className="text-red-500 text-sm">{errors.classLevel}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              className="w-full border rounded px-3 py-2"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading || success}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
          {/* Institution */}
          <div>
            <label className="block font-medium mb-1">Institution Name</label>
            <input
              type="text"
              name="institution"
              className="w-full border rounded px-3 py-2"
              value={formData.institution}
              onChange={handleChange}
              disabled={loading || success}
            />
            {errors.institution && <p className="text-red-500 text-sm">{errors.institution}</p>}
          </div>
          {/* Country */}
          <div>
            <label className="block font-medium mb-1">Country</label>
            <select
              name="country"
              className="w-full border rounded px-3 py-2"
              value={formData.country}
              onChange={handleChange}
              disabled={loading || success}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block font-medium mb-1">State</label>
            <select
              name="state"
              className="w-full border rounded px-3 py-2"
              value={formData.state}
              onChange={handleChange}
              disabled={!formData.country || loading || success}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block font-medium mb-1">City</label>
            <select
              name="city"
              className="w-full border rounded px-3 py-2"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.country || !formData.state || loading || success}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>

        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading || success}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default EnrollmentPage;
