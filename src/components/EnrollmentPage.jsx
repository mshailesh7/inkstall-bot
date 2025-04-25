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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-2 sm:px-4 md:px-0 webkit-text-adjust">
      <div className="border-2 border-[#b7d8fb] bg-gradient-to-br from-[#e3f0ff] to-[#b3d1f8] rounded-2xl shadow-xl flex flex-col md:flex-row w-full max-w-3xl p-1 sm:p-2 md:p-4" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
        {/* Left side - Form */}
        <div className="w-full md:w-[60%] flex flex-col justify-center p-3 sm:p-4 md:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">Enrollment Form</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Set Up Your Student Profile</p>
          
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
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-sm text-gray-700 font-medium mb-3">1. Basic Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="board"
                    placeholder="Board"
                    className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.board}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                  {errors.board && (
                    <p className="text-red-500 text-sm mt-1">{errors.board}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="classLevel"
                    placeholder="Grade/Class"
                    className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.classLevel}
                    onChange={handleChange}
                    disabled={loading || success}
                  />
                  {errors.classLevel && (
                    <p className="text-red-500 text-sm mt-1">{errors.classLevel}</p>
                  )}
                </div>
                <div>
                  <select
                    name="gender"
                    placeholder="Gender"
                    className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading || success}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution Name"
                  className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.institution}
                  onChange={handleChange}
                  disabled={loading || success}
                />
                {errors.institution && (
                  <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-700 font-medium mb-3">2. Location</p>
              <div className="mb-4">
                <select
                  name="country"
                  className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <select
                    name="state"
                    className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <select
                    name="city"
                    className="w-full bg-gradient-to-r from-[#b5d4fa] to-[#e3f0ff] border border-white rounded-lg px-4 py-2 placeholder-gray-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 sm:mt-4">
              <button
                type="submit"
                className="bg-white text-gray-800 font-medium border border-white rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors inline-flex items-center shadow-sm"
                disabled={loading || success}
              >
                {loading ? "Submitting..." : "Submit ›"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Right side - Illustration */}
        <div className="hidden sm:flex w-full md:w-[45%] items-center justify-center p-0 sm:p-2 mt-4 md:mt-0 order-2 md:order-none">
          <div className="border-2 border-white rounded-2xl bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center w-full h-[300px] min-h-[300px] sm:h-[400px] sm:min-h-[400px] md:h-[500px] md:min-h-[500px] m-0 md:m-2 relative">
            {/* Rocket illustration */}
            <svg className="w-32 h-32 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9 2 4 3 4 10C4 14 6 16 8 16C9 16 9 15 9 14C9 13 10 12 12 12C14 12 15 13 15 14C15 15 15 16 16 16C18 16 20 14 20 10C20 3 15 2 12 2Z" fill="white"/>
              <path d="M12 17C10.4 17 9 18 9 19C9 20 10 21 12 21C14 21 15 20 15 19C15 18 13.6 17 12 17Z" fill="white"/>
              <path d="M12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5Z" fill="#3B82F6"/>
            </svg>
            
            {/* Paper balls */}
            <div className="absolute bottom-12 left-12 w-10 h-10 rounded-full bg-white"></div>
            <div className="absolute bottom-24 left-24 w-8 h-8 rounded-full bg-white"></div>
            <div className="absolute bottom-20 right-16 w-12 h-12 rounded-full bg-white"></div>
            <div className="absolute top-24 right-12 w-9 h-9 rounded-full bg-white"></div>
            <div className="absolute bottom-32 left-16 w-7 h-7 rounded-full bg-white"></div>
            <div className="absolute bottom-16 right-32 w-10 h-10 rounded-full bg-white"></div>
            <div className="absolute top-32 left-20 w-8 h-8 rounded-full bg-white"></div>
            
            {/* Dotted flight paths */}
            <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 400 400" fill="none">
              <path d="M100,100 Q150,150 200,120 T300,200" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M150,200 Q200,150 250,180 T350,100" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M120,250 Q170,200 220,230 T320,150" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
