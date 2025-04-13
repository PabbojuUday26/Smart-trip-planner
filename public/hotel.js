
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('open');
        nav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            nav.classList.remove('active');
        });
    });
    
    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Hotel Search Functionality
    const searchHotelsBtn = document.getElementById('search-hotels');
    const hotelsList = document.getElementById('hotels-list');
    const bookingSummary = document.getElementById('booking-summary');
    const bookingModal = document.getElementById('booking-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelBookingBtn = document.getElementById('cancel-booking');
    const confirmBookingBtn = document.getElementById('confirm-booking');
    const doneButton = document.getElementById('done-button');
    
    // Sample hotel data
    const sampleHotels = [
        {
            id: 1,
            name: "Grand Hotel",
            location: "Bangalore, India",
            rating: 4.5,
            price: 8500,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym"],
            description: "Luxury accommodations with spa and rooftop pool in the heart of the city."
        },
        {
            id: 2,
            name: "Seaside Resort",
            location: "Goa, India",
            rating: 4.2,
            price: 12000,
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            amenities: ["Beach Access", "Free WiFi", "Pool", "Breakfast Included"],
            description: "Beachfront resort with private beach access and stunning ocean views."
        },
        {
            id: 3,
            name: "Mountain View Lodge",
            location: "Shimla, India",
            rating: 4.7,
            price: 6500,
            image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            amenities: ["Mountain View", "Free WiFi", "Restaurant", "Fireplace"],
            description: "Cozy lodge with panoramic mountain views and rustic charm."
        },
        {
            id: 4,
            name: "Urban Suites",
            location: "Mumbai, India",
            rating: 4.0,
            price: 7500,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
            amenities: ["Free WiFi", "Business Center", "Gym", "24/7 Room Service"],
            description: "Modern suites in the business district with all amenities for the urban traveler."
        },
        {
            id: 5,
            name: "Heritage Palace Hotel",
            location: "Jaipur, India",
            rating: 4.8,
            price: 9500,
            image: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80",
            amenities: ["Historic Building", "Pool", "Spa", "Fine Dining"],
            description: "Experience royal luxury in this beautifully restored heritage palace."
        }
    ];

    // Variables to store booking data
    let selectedHotel = null;
    let checkInDate = null;
    let checkOutDate = null;
    let guests = 2;
    let nights = 3;

    // Search hotels function
    searchHotelsBtn.addEventListener('click', function() {
        const destination = document.getElementById('destination').value;
        checkInDate = document.getElementById('check-in').value;
        checkOutDate = document.getElementById('check-out').value;
        guests = document.getElementById('guests').value;
        
        if (!destination) {
            alert('Please enter a destination');
            return;
        }
        
        if (!checkInDate || !checkOutDate) {
            alert('Please select check-in and check-out dates');
            return;
        }
        
        // Calculate number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights <= 0) {
            alert('Check-out date must be after check-in date');
            return;
        }
        
        // Show loading state
        hotelsList.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Searching hotels...</p>';
        
        // Simulate API call with timeout
        setTimeout(() => {
            displayHotels(sampleHotels);
        }, 1000);
    });

    // Display hotels function
    function displayHotels(hotels) {
        hotelsList.innerHTML = '';
        
        if (hotels.length === 0) {
            hotelsList.innerHTML = '<p>No hotels found matching your criteria. Try different dates or location.</p>';
            return;
        }
        
        hotels.forEach(hotel => {
            const hotelElement = document.createElement('div');
            hotelElement.className = 'hotel-card';
            hotelElement.dataset.id = hotel.id;
            
            hotelElement.innerHTML = `
                <div class="hotel-image">
                    <img src="${hotel.image}" alt="${hotel.name}">
                    <div class="hotel-rating">
                        <i class="fas fa-star"></i> ${hotel.rating}
                    </div>
                </div>
                <div class="hotel-details">
                    <div class="hotel-header">
                        <div class="hotel-title">${hotel.name}</div>
                        <div class="hotel-price">₹${hotel.price.toLocaleString()}<small>/night</small></div>
                    </div>
                    <div class="hotel-location">
                        <i class="fas fa-map-marker-alt"></i> ${hotel.location}
                    </div>
                    <p class="hotel-description">${hotel.description}</p>
                    <div class="hotel-amenities">
                        ${hotel.amenities.map(amenity => `
                            <div class="amenity">
                                <i class="fas fa-check"></i> ${amenity}
                            </div>
                        `).join('')}
                    </div>
                    <div class="hotel-actions">
                        <button class="plan-btn small-btn select-hotel" data-id="${hotel.id}">
                            <i class="fas fa-bed"></i> Select Room
                        </button>
                    </div>
                </div>
            `;
            
            hotelsList.appendChild(hotelElement);
        });
        
        // Add event listeners to select buttons
        document.querySelectorAll('.select-hotel').forEach(button => {
            button.addEventListener('click', function() {
                const hotelId = parseInt(this.dataset.id);
                selectHotel(hotelId);
            });
        });
    }

    // Select hotel function
    function selectHotel(hotelId) {
        selectedHotel = sampleHotels.find(hotel => hotel.id === hotelId);
        
        if (!selectedHotel) return;
        
        // Update booking summary
        const totalPrice = selectedHotel.price * nights;
        const formattedCheckIn = formatDate(checkInDate);
        const formattedCheckOut = formatDate(checkOutDate);
        
        bookingSummary.innerHTML = `
            <h3><i class="fas fa-receipt"></i> Booking Summary</h3>
            <div class="selected-hotel">
                <div class="selected-hotel-header">
                    <div class="selected-hotel-title">${selectedHotel.name}</div>
                    <div class="selected-hotel-price">₹${selectedHotel.price.toLocaleString()}/night</div>
                </div>
                <div class="selected-hotel-dates">${formattedCheckIn} - ${formattedCheckOut} (${nights} nights)</div>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span>${nights} nights x ₹${selectedHotel.price.toLocaleString()}</span>
                    <span>₹${(selectedHotel.price * nights).toLocaleString()}</span>
                </div>
                <div class="booking-detail">
                    <span>Taxes & Fees</span>
                    <span>₹${Math.round(selectedHotel.price * nights * 0.18).toLocaleString()}</span>
                </div>
                <div class="booking-detail total">
                    <span>Total</span>
                    <span>₹${Math.round(selectedHotel.price * nights * 1.18).toLocaleString()}</span>
                </div>
            </div>
            <div class="booking-actions">
                <button class="plan-btn" id="book-now">
                    <i class="fas fa-credit-card"></i> Book Now
                </button>
            </div>
        `;
        
        // Add event listener to book now button
        document.getElementById('book-now').addEventListener('click', showBookingModal);
    }

    // Show booking modal function
    function showBookingModal() {
        if (!selectedHotel) return;
        
        const formattedCheckIn = formatDate(checkInDate);
        const formattedCheckOut = formatDate(checkOutDate);
        const totalPrice = Math.round(selectedHotel.price * nights * 1.18);
        
        // Update modal content
        document.getElementById('modal-hotel-name').textContent = selectedHotel.name;
        document.getElementById('modal-hotel-price').textContent = `₹${totalPrice.toLocaleString()}`;
        document.getElementById('modal-hotel-dates').textContent = 
            `${formattedCheckIn} - ${formattedCheckOut} (${nights} nights)`;
        
        // Show modal
        bookingModal.classList.add('active');
        
        // Reset form
        document.getElementById('full-name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('card-number').value = '';
        document.getElementById('expiry-date').value = '';
        document.getElementById('cvv').value = '';
        document.getElementById('card-name').value = '';
    }

    // Close modal function
    function closeModal() {
        bookingModal.classList.remove('active');
    }

    // Close confirmation modal function
    function closeConfirmationModal() {
        confirmationModal.classList.remove('active');
    }

    // Format date function
    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Event listeners for modals
    modalClose.addEventListener('click', closeModal);
    cancelBookingBtn.addEventListener('click', closeModal);
    
    confirmBookingBtn.addEventListener('click', function() {
        // Validate form
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('card-name').value;
        
        if (!fullName || !email || !phone || !cardNumber || !expiryDate || !cvv || !cardName) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Simulate payment processing
        confirmBookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmBookingBtn.disabled = true;
        
        setTimeout(() => {
            // Show confirmation
            showConfirmation();
            
            // Reset button
            confirmBookingBtn.innerHTML = '<i class="fas fa-lock"></i> Confirm Booking';
            confirmBookingBtn.disabled = false;
            
            // Close booking modal
            closeModal();
        }, 2000);
    });
    
    doneButton.addEventListener('click', function() {
        closeConfirmationModal();
    });

    // Show confirmation function
    function showConfirmation() {
        if (!selectedHotel) return;
        
        const totalPrice = Math.round(selectedHotel.price * nights * 1.18);
        const formattedCheckIn = formatDate(checkInDate);
        const formattedCheckOut = formatDate(checkOutDate);
        
        // Update confirmation modal
        document.getElementById('confirmation-hotel').textContent = selectedHotel.name;
        document.getElementById('confirmation-dates').textContent = 
            `${formattedCheckIn} - ${formattedCheckOut} (${nights} nights)`;
        document.getElementById('confirmation-guests').textContent = guests;
        document.getElementById('confirmation-total').textContent = `₹${totalPrice.toLocaleString()}`;
        
        // Show modal
        confirmationModal.classList.add('active');
    }

    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Set default dates (today + 3 days)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaultCheckOut = new Date(today);
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);
    
    document.getElementById('check-in').valueAsDate = tomorrow;
    document.getElementById('check-out').valueAsDate = defaultCheckOut;
});
