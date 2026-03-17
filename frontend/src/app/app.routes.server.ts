import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public pages can be prerendered
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },
  { path: 'register-driver', renderMode: RenderMode.Prerender },
  { path: 'driver-status', renderMode: RenderMode.Client },
  { path: 'forbidden', renderMode: RenderMode.Prerender },
  { path: 'unauthorized', renderMode: RenderMode.Prerender },

  // Authenticated pages must render on the client only
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: 'home', renderMode: RenderMode.Client },
  { path: 'viagens', renderMode: RenderMode.Client },
  { path: 'viagem/**', renderMode: RenderMode.Client },
  { path: 'motorista', renderMode: RenderMode.Client },
  { path: 'ofertar-viagem', renderMode: RenderMode.Client },
  { path: 'seu-veiculo', renderMode: RenderMode.Client },
  { path: 'viagens-motorista', renderMode: RenderMode.Client },
  { path: 'ajustar-valores', renderMode: RenderMode.Client },
  { path: 'faturamento', renderMode: RenderMode.Client },
  { path: 'buscar-viagens', renderMode: RenderMode.Client },
  { path: 'perfil', renderMode: RenderMode.Client },

  // Fallback
  { path: '**', renderMode: RenderMode.Client }
];
