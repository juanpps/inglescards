import { useSearchParams, useNavigate } from 'react-router-dom';
import { CardFormModal } from '../components/cards/CardFormModal';

export function NuevaTarjeta() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const groupId = searchParams.get('group') ?? undefined;

  return (
    <CardFormModal
      initialGroupId={groupId}
      onClose={() => navigate('/grupos')}
      onSuccess={() => navigate('/grupos')}
    />
  );
}
