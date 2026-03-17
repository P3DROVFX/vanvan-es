import { TagVariant } from '../components/tags/tags';
import { TripHistoryDTO } from '../services/trip.service';
import { UiTrip, UiSearchTrip, RecentTrip } from '../models/trip-ui.model';

const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

/**
 * Utilitário centralizado para mapeamento de viagens DTO → UI.
 * Elimina duplicação de lógica entre home, viagens, search-trips, relatorios, motorista-page.
 */
export class TripMapper {

  static getStatusInfo(status: string): { variant: TagVariant; label: string } {
    switch (status) {
      case 'SCHEDULED':
        return { variant: 'success', label: 'Confirmado' };
      case 'COMPLETED':
        return { variant: 'success', label: 'Finalizado' };
      case 'CANCELLED':
        return { variant: 'error', label: 'Cancelado' };
      case 'IN_PROGRESS':
        return { variant: 'warning', label: 'Em Viagem' };
      default:
        return { variant: 'warning', label: 'Aguardando' };
    }
  }

  static parseDate(dateStr: string): { year: string; month: string; day: string; monthStr: string } {
    const [year, month, day] = dateStr ? dateStr.split('-') : ['2025', '01', '01'];
    const monthIndex = parseInt(month, 10) - 1;
    return {
      year,
      month,
      day,
      monthStr: MONTHS[monthIndex] || 'JAN'
    };
  }

  static formatPrice(amount: number): string {
    return `R$${amount.toFixed(2).replace('.', ',')}`;
  }

  static extractCityName(dto: TripHistoryDTO, type: 'departure' | 'arrival'): string {
    if (type === 'departure') {
      let name = dto.departureCity || dto.departureStreet;
      if (!name && dto.route && dto.route.includes('->')) return dto.route.split('->')[0].trim();
      return name || 'Origem';
    } else {
      let name = dto.arrivalCity || dto.arrivalStreet;
      if (!name && dto.route && dto.route.includes('->')) return dto.route.split('->')[1].trim();
      return name || 'Destino';
    }
  }

  /**
   * Mapeia TripHistoryDTO para UiTrip (usado em home, viagens, etc.).
   */
  static toUiTrip(dto: TripHistoryDTO, isFirst = false): UiTrip {
    const { day, monthStr } = TripMapper.parseDate(dto.date);
    const { variant, label } = TripMapper.getStatusInfo(dto.status);

    return {
      id: dto.id,
      month: monthStr,
      day,
      time: dto.time,
      origin: TripMapper.extractCityName(dto, 'departure'),
      destination: TripMapper.extractCityName(dto, 'arrival'),
      price: TripMapper.formatPrice(dto.totalAmount),
      vehicle: 'Van',
      plate: 'XXXX',
      route: dto.route,
      pickupPoint: dto.departureStreet || dto.departureCity || 'Centro',
      driverName: dto.driverName,
      driverContact: 'Contato via chat',
      driverRating: (dto as any).driverRating || '5.0',
      variant,
      statusLabel: label,
      originalDate: dto.date,
      originalStatus: dto.status,
      isFirst,
    };
  }

  /**
   * Mapeia TripHistoryDTO para UiSearchTrip (usado em search-trips).
   */
  static toSearchTrip(dto: any): UiSearchTrip {
    const { day, monthStr } = TripMapper.parseDate(dto.date);
    const routeStr = dto.route || '';
    let depName = dto.departureCity || dto.departureStreet;
    let arrName = dto.arrivalCity || dto.arrivalStreet;
    if (routeStr.includes('->')) {
      const parts = routeStr.split('->');
      depName = parts[0].trim();
      arrName = parts[1].trim();
    }

    return {
      id: dto.id,
      origem: depName,
      destino: arrName,
      route: `${depName} -> ${arrName}`,
      mes: monthStr,
      dia: day,
      horario: dto.time ? dto.time.substring(0, 5) : '08:00',
      vagas: dto.availableSeats ?? (dto.totalSeats ? dto.totalSeats - (dto.passengerCount || 0) : 4),
      preco: dto.pricePerSeat || dto.totalAmount || 0,
      distancia: dto.distanceKm ? dto.distanceKm : 0,
      localPartida: dto.departureStreet || dto.departureCity || 'Centro',
      pontoReferencia: dto.departureReference || '-',
      veiculoModelo: dto.vehicleModel || 'Carro',
      veiculoPlaca: dto.vehiclePlate || 'XXXX',
      motoristaNome: dto.driverName || 'Motorista',
      motoristaNota: dto.driverRating || '5.0',
      imagemVeiculo: 'https://placehold.co/225x118'
    };
  }

  /**
   * Mapeia TripHistoryDTO para RecentTrip (usado em relatorios).
   */
  static toRecentTrip(dto: TripHistoryDTO): RecentTrip {
    const { day, month } = TripMapper.parseDate(dto.date);
    const { variant, label } = TripMapper.getStatusInfo(dto.status);

    return {
      date: `${day}/${month}`,
      origin: dto.departureCity || '---',
      destination: dto.arrivalCity || '---',
      driver: dto.driverName || '---',
      status: label,
      variant,
      vehicle: 'Van',
      price: `R$ ${(dto.totalAmount || 0).toFixed(2).replace('.', ',')}`,
      passengers: dto.passengerCount || 0,
      capacity: dto.totalSeats || 15,
      licensePlate: '---'
    };
  }
}
