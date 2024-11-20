// Initialize Supabase client once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase client after Supabase script is loaded
  const supabaseUrl = 'https://bropsbciytorzazaklor.supabase.co'; // Replace with your Supabase URL
  const supabaseKey = 'your-supabase-key'; // Replace with your Supabase key
  
  // Correct way to initialize the client
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // Handle form submission for rating
  document.getElementById('ratingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemId = document.getElementById('itemId').value;
    const rating = document.getElementById('rating').value;

    // Insert rating into Supabase
    const { data, error } = await supabase
      .from('ratings')
      .insert([{ item_id: itemId, rating: parseInt(rating) }]);

    if (error) {
      console.error('Error saving rating:', error.message);
      alert('Error submitting your rating. Please try again.');
    } else {
      alert('Rating submitted successfully!');
      fetchAverageRating(itemId); // Refresh the average rating
    }
  });

  // Fetch and display the average rating
  async function fetchAverageRating(itemId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('item_id', itemId);

    if (error) {
      console.error('Error fetching ratings:', error.message);
      document.getElementById('averageRating').innerText = 'Error loading ratings.';
      return;
    }

    const totalRatings = data.length;
    if (totalRatings === 0) {
      document.getElementById('averageRating').innerText = 'No ratings yet.';
      return;
    }

    const averageRating =
      data.reduce((sum, { rating }) => sum + rating, 0) / totalRatings;

    document.getElementById('averageRating').innerText =
      `Average Rating: ${averageRating.toFixed(1)} (${totalRatings} reviews)`;
  }

  // Initial fetch of the average rating for the example item
  fetchAverageRating(12345);
});
