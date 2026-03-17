import { TagVariant } from '../components/tags/tags';

/**
 * Interface para viagem exibida na UI.
 * Substitui o uso de `any` nos componentes de viagem.
 */
export interface UiTrip {
  id: number;
  month: string;
  day: string;
  time: string;
  origin: string;
  destination: string;
  price: string;
  route?: string;
  vehicle: string;
  plate: string;
  pickupPoint: string;
  driverName: string;
  driverContact?: string;
  driverRating: string;
  variant: TagVariant;
  statusLabel: string;
  originalDate?: string;
  originalStatus?: string;
  isFirst?: boolean;
}

/**
 * Interface para viagem de busca exibida na UI.
 */
export interface UiSearchTrip {
  id: number;
  origem: string;
  destino: string;
  route: string;
  mes: string;
  dia: string;
  horario: string;
  vagas: number;
  preco: number;
  distancia: number;
  localPartida: string;
  pontoReferencia: string;
  veiculoModelo: string;
  veiculoPlaca: string;
  motoristaNome: string;
  motoristaNota: string;
  imagemVeiculo: string;
}

/**
 * Interface para passageiro em viagem do motorista.
 */
export interface UiTripPassenger {
  name: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  seat: number;
}

/**
 * Interface para viagem ativa do motorista.
 */
export interface UiDriverTrip {
  id: number;
  availableSeats: number;
  confirmedPassengers: number;
  passengers: UiTripPassenger[];
  origin: string;
  destination: string;
  distance: string;
  distanceNum: number;
  departureLocation: string;
  arrivalLocation: string;
  date: string;
  time: string;
  pricePerSeat: number;
}

/**
 * Viagem passada completa (usada em viagens-motorista e ofertar-viagem).
 */
export interface PastTrip {
  id: string;
  origin: string;
  originLocation?: string;
  originReference?: string;
  destination: string;
  destinationLocation?: string;
  destinationReference?: string;
  price: string;
  distance: string;
  date: string;
  time: string;
  passengers?: number;
  status?: 'completed' | 'cancelled';
  vehicleName?: string;
  vehiclePlate?: string;
}

/**
 * Interface para viagem recente no relatório admin.
 */
export interface RecentTrip {
  date: string;
  origin: string;
  destination: string;
  driver: string;
  status: string;
  variant: TagVariant;
  vehicle: string;
  price: string;
  passengers: number;
  capacity: number;
  licensePlate: string;
}
