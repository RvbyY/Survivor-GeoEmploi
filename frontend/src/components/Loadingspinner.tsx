export default function LoadingSpinner() {
  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e0e0e0',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )
}