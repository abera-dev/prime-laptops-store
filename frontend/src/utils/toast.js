import toast from 'react-hot-toast';

const base = {
  borderRadius: '12px',
  background: '#1e1e2e',
  color: '#fff',
  boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500',
};

const success = (msg) =>
  toast.success(msg, {
    style: { ...base, borderLeft: '4px solid #22c55e' },
    icon: '✓',
    duration: 3000,
  });

const error = (msg) =>
  toast.error(msg, {
    style: { ...base, borderLeft: '4px solid #ef4444' },
    icon: '✗',
    duration: 3000,
  });

const warning = (msg) =>
  toast(msg, {
    style: { ...base, borderLeft: '4px solid #eab308' },
    icon: '⚠',
    duration: 3000,
  });

export default { success, error, warning };
