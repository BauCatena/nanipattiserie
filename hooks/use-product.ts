import { supabase } from '@/lib/supabase';

const fetchProductosPorColor = async (color: string) => {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('atributos->color', color); // Tu filtro JSONB funcional

  return data;
};