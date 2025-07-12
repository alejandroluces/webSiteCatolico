/**
 * Servicio para sincronizar el evangelio del día con el servidor
 */
export class GospelSyncService {
  /**
   * Sincroniza el evangelio del día actual llamando al API del servidor
   */
  static async syncTodayGospel(): Promise<boolean> {
    try {
      console.log('🔄 Llamando al servidor para sincronizar el evangelio...');
      const response = await fetch('http://localhost:3001/api/sync-gospel');
      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Sincronización del evangelio completada por el servidor.');
        return true;
      } else {
        console.error('❌ Error al sincronizar el evangelio desde el servidor:', data.message || 'Error desconocido');
        return false;
      }
    } catch (error) {
      console.error('❌ Error de red o inesperado al llamar al servidor de sincronización:', error);
      return false;
    }
  }
}
