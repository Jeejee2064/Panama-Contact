
export default function Badge({ tag }) {
  const styles = {
    'VISA': 'bg-orange-500 text-white',
    'FIRST STEP': 'bg-gray-800 text-white',
  };

  return (
    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${styles[tag] ?? 'bg-gray-200 text-gray-700'}`}>
      {tag}
    </span>
  );
}