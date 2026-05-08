// Local-to-Network Data Synchronization Service
import { supabase } from './supabase';

export interface SyncItem {
  id: string;
  userId: string;
  entityType: string;
  operation: 'create' | 'update' | 'delete';
  entityId: string;
  data: any;
  timestamp: Date;
  synced: boolean;
}

export class DataSyncService {
  private syncQueue: Map<string, SyncItem> = new Map();
  private isSyncing = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSyncQueue();
    this.startAutoSync();
  }

  // Add item to local sync queue
  queueChange(userId: string, entityType: string, operation: 'create' | 'update' | 'delete', entityId: string, data: any): void {
    const id = this.generateId();
    const syncItem: SyncItem = {
      id,
      userId,
      entityType,
      operation,
      entityId,
      data,
      timestamp: new Date(),
      synced: false
    };

    this.syncQueue.set(id, syncItem);
    this.saveSyncQueue();
    this.syncToNetwork();
  }

  // Sync queued changes to network database
  async syncToNetwork(): Promise<boolean> {
    if (this.isSyncing || this.syncQueue.size === 0) {
      return true;
    }

    this.isSyncing = true;

    try {
      const unsynced = Array.from(this.syncQueue.values()).filter(item => !item.synced);

      for (const item of unsynced) {
        const success = await this.syncItem(item);
        if (success) {
          item.synced = true;
          this.saveSyncQueue();
        } else {
          console.error(`Failed to sync ${item.entityType} ${item.entityId}`);
          this.isSyncing = false;
          return false;
        }
      }

      // Clean up synced items
      this.syncQueue.forEach((item, key) => {
        if (item.synced) {
          this.syncQueue.delete(key);
        }
      });
      this.saveSyncQueue();

      this.isSyncing = false;
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      this.isSyncing = false;
      return false;
    }
  }

  // Sync individual item
  private async syncItem(item: SyncItem): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sync_queue')
        .insert({
          user_id: item.userId,
          entity_type: item.entityType,
          operation: item.operation,
          entity_id: item.entityId,
          data: item.data,
          synced: false
        });

      return !error;
    } catch (error) {
      console.error('Error syncing item:', error);
      return false;
    }
  }

  // Get sync status
  getSyncStatus(): { totalItems: number; syncedItems: number; pendingItems: number } {
    const totalItems = this.syncQueue.size;
    const syncedItems = Array.from(this.syncQueue.values()).filter(item => item.synced).length;
    const pendingItems = totalItems - syncedItems;

    return { totalItems, syncedItems, pendingItems };
  }

  // Check if data is synced
  isFullySynced(): boolean {
    return Array.from(this.syncQueue.values()).every(item => item.synced);
  }

  // Manual sync trigger
  async manualSync(): Promise<boolean> {
    return this.syncToNetwork();
  }

  // Private methods
  private startAutoSync(): void {
    this.syncInterval = setInterval(() => {
      this.syncToNetwork();
    }, 30000); // Sync every 30 seconds
  }

  private saveSyncQueue(): void {
    const queueData = Array.from(this.syncQueue.entries()).map(([id, item]) => [id, {
      ...item,
      timestamp: item.timestamp.toISOString()
    }]);
    localStorage.setItem('syncQueue', JSON.stringify(queueData));
  }

  private loadSyncQueue(): void {
    try {
      const data = localStorage.getItem('syncQueue');
      if (data) {
        const queueData = JSON.parse(data);
        queueData.forEach(([id, item]: [string, any]) => {
          this.syncQueue.set(id, {
            ...item,
            timestamp: new Date(item.timestamp)
          });
        });
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }
}

export const dataSyncService = new DataSyncService();
