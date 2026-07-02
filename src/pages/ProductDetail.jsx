import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import toast from '../utils/toast';

export default function ProductDetail() {
  const { id }            = useParams();
  const [product, setP]   = useState(null);
  const [loading, setL]   = useState(true);
  const [qty, setQty]     = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const { addToCart }     = useCart();
  const { user }          = useAuth();

  const [reviews, setReviews]       = useState([]);
  const [avgRating, setAvgRating]   = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating]     = useState(0);
  const [myComment, setMyComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setP(r.data))
      .catch(() => setP(null))
      .finally(() => setL(false));
  }, [id]);

  useEffect(() => {
    setFetchingReviews(true);
    api.get(`/products/${id}/reviews`)
      .then(r => {
        setReviews(r.data.reviews);
        setAvgRating(r.data.avg_rating);
        setReviewCount(r.data.review_count);
      })
      .catch(() => {})
      .finally(() => setFetchingReviews(false));
  }, [id]);

  const userReview = user ? reviews.find(r => r.user_id === user.id) : null;
  const hasReviewed = !!userReview;

  const handleAdd = async () => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    try {
      await addToCart(product.id, qty);
      toast.success('Added to cart!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!myRating) { toast.error('Please select a rating.'); return; }
    setSubmitting(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, { rating: myRating, comment: myComment });
      setReviews(prev => [res.data, ...prev]);
      setReviewCount(c => c + 1);
      setAvgRating(((avgRating * reviewCount) + myRating) / (reviewCount + 1));
      setMyRating(0);
      setMyComment('');
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/products/${id}/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setReviewCount(c => c - 1);
      toast.success('Review deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan"/></div>;
  if (!product) return <div className="text-center py-20"><p className="text-slate-400">Product not found.</p><Link to="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link></div>;

  const images = [product.image, product.image2, product.image3].filter(Boolean);

  const specs = [
    { label: 'Processor', value: product.cpu },
    { label: 'RAM', value: `${product.ram_gb} GB` },
    { label: 'Storage', value: `${product.storage_gb} SSD` },
    { label: 'Graphics', value: product.gpu },
    { label: 'Screen Size', value: `${product.size_inches} inches` },
    { label: 'Brand', value: product.brand },
    { label: 'In Stock', value: product.stock > 0 ? `${product.stock} units` : 'Out of stock' },
  ];

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/products" className="text-sm text-cyan hover:underline mb-6 inline-block">Back to Shop</Link>

      <div className="card overflow-visible grid md:grid-cols-2 gap-0">
        <div className="bg-white/[0.03] p-6 md:p-8 flex flex-col items-center justify-center rounded-l-lg min-h-[480px]">
          <img src={images[selectedImg]} alt={product.name} className="w-full max-w-lg object-contain rounded-lg max-h-[400px]"
            onError={e => e.target.src='https://via.placeholder.com/600x400?text=Laptop'} />
          {images.length > 1 && (
            <div className="flex gap-3 mt-5 flex-wrap justify-center">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-28 h-28 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${selectedImg === i ? 'border-cyan' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover"
                    onError={e => e.target.src='https://via.placeholder.com/112x112?text=Img'} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-8">
          <span className="badge mb-2">{product.brand}</span>
          <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50 mt-2 mb-2 leading-none">{product.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={avgRating} size="sm" />
            <span className="text-sm text-slate-400">
              {avgRating > 0 ? `${avgRating} (${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})` : 'No reviews yet'}
            </span>
          </div>

          <p className="tech-price text-3xl mb-6">${Number(product.price).toLocaleString()}</p>

          <div className="border-t border-white/10 pt-4 mb-6">
            <h3 className="font-display text-2xl font-bold text-slate-50 mb-3">Specifications</h3>
            <dl className="space-y-2">
              {specs.map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <dt className="text-slate-500">{s.label}</dt>
                  <dd className="font-mono font-medium text-slate-200 text-right max-w-xs">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm text-slate-400">Qty:</label>
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-2 hover:bg-white/10 font-bold">-</button>
                <span className="px-4 py-2 text-sm font-mono font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3 py-2 hover:bg-white/10 font-bold">+</button>
              </div>
            </div>
          )}

          <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary w-full py-3 text-base">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card p-8 mt-8">
        <h2 className="font-display text-2xl font-bold text-slate-50 mb-6">
          Customer Reviews
          {reviewCount > 0 && <span className="text-slate-500 font-normal text-lg ml-2">({reviewCount})</span>}
        </h2>

        {/* Add Review Form */}
        {!user ? (
          <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-slate-400 text-sm">
              <Link to="/login" className="text-cyan hover:underline">Login</Link> to leave a review.
            </p>
          </div>
        ) : hasReviewed ? (
          <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-slate-400 text-sm">You have already reviewed this product.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-display text-lg font-semibold text-slate-200 mb-3">Write a Review</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-400">Your rating:</span>
              <StarRating rating={myRating} size="lg" interactive onRate={setMyRating} />
              {myRating > 0 && <span className="text-sm text-slate-500 ml-1">({myRating}/5)</span>}
            </div>
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              placeholder="Share your thoughts about this product (optional)..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan/50 resize-none mb-3"
              rows={3}
              maxLength={2000}
            />
            <button type="submit" disabled={submitting || !myRating} className="btn-primary text-sm">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {fetchingReviews ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-200 text-sm">
                      {review.user_name?.split(' ')[0]}
                    </span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{formatDate(review.created_at)}</span>
                    {(user?.id === review.user_id || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-400 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
