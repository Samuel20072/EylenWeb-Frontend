import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES DE DOMINIO (DTOS y Entidades) ---

// Modelo base para un Paquete (Package)
export interface Package {
    id: number;
    name: string;
    description?: string;
    price: number;
    durationWeeks: number;
    sessionsCount: number;
    imageUrl?: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

// Interfaz para una compra de paquete (usada por el administrador)
export interface PackagePurchase {
    id: number;
    packageId: number;
    userId: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    proofOfPaymentUrl: string;
    notes?: string;
    createdAt: string;
    // Incluimos las entidades relacionadas para mostrar en la interfaz de administración
    package?: Package;
    user?: { id: number; email: string; full_name: string };
    // [NUEVO CAMPO]: Contexto útil para el administrador
    userHasActiveClasses?: boolean;
    // [NUEVO CAMPO]: Sesiones restantes calculadas por el backend
    remainingSessions?: number;
}

// DTO para la CREACIÓN de Paquetes
export interface CreatePackagesDto {
    name: string;
    description?: string;
    price: number;
    durationWeeks: number;
    sessionsCount: number;
    imageUrl?: string;
    isActive: boolean;
}

// DTO para la Actualización parcial (PATCH)
export interface UpdatePackagesDto extends Partial<CreatePackagesDto> { }

// DTO para la Compra de Paquete (solo requiere las notas del formulario)
export interface CreatePackagePurchaseDto {
    notes?: string;
}

// DTO para Activar/Desactivar estado
export interface ToggleStatusDto {
    isActive: boolean;
}


// --- SERVICIO DE ADMINISTRACIÓN: /admin/packages ---
@Injectable({
    providedIn: 'root'
})
export class AdminPackageService {

    // Ruta base para endpoints administrativos
    private apiUrl = 'http://localhost:3000/admin/packages';
    private apiUrl2 = 'http://localhost:3000/packages'; // Usado para findAllPackages

    constructor(private http: HttpClient) { }

    /**
     * [Admin] POST /admin/packages - Crear paquete
     * @param dto Los datos del nuevo paquete.
     * @returns Observable<Package>
     */
    createPackage(dto: CreatePackagesDto): Observable<Package> {
        return this.http.post<Package>(this.apiUrl, dto);
    }

    /**
     * [Admin] GET /admin/packages - Obtiene TODOS los paquetes (activos e inactivos).
     * @returns Observable<Package[]>
     */
    findAllPackages(): Observable<Package[]> {
        return this.http.get<Package[]>(this.apiUrl2);
    }

    /**
     * [Admin] GET /admin/packages/purchases - Obtiene todas las compras pendientes de aprobación.
     * @returns Observable<PackagePurchase[]>
     */
    getPurchases(): Observable<PackagePurchase[]> {
        // Mapea a la ruta: GET /admin/packages/purchases
        return this.http.get<PackagePurchase[]>(`${this.apiUrl}/purchases`);
    }

    /**
     * [Admin] GET /admin/packages/:id - Obtiene un paquete específico (activo o inactivo).
     * @param id El ID del paquete.
     * @returns Observable<Package>
     */
    findOnePackage(id: number): Observable<Package> {
        // Mapea a la ruta: GET /admin/packages/:id
        return this.http.get<Package>(`${this.apiUrl}/${id}`);
    }

    /**
     * [Admin] PATCH /admin/packages/:id - Actualiza parcialmente un paquete.
     * @param id El ID del paquete a actualizar.
     * @param dto Los campos a modificar.
     * @returns Observable<Package>
     */
    updatePackage(id: number, dto: UpdatePackagesDto): Observable<Package> {
        return this.http.patch<Package>(`${this.apiUrl}/${id}`, dto);
    }

    /**
     * [Admin] PATCH /admin/packages/:id/status - Activa o desactiva un paquete.
     * @param id El ID del paquete a modificar.
     * @param dto { isActive: boolean }
     * @returns Observable<Package> El paquete actualizado.
     */
    toggleStatus(id: number, dto: ToggleStatusDto): Observable<Package> {
        // Mapea a la ruta: PATCH /admin/packages/:id/status
        return this.http.patch<Package>(`${this.apiUrl}/${id}/status`, dto);
    }

    /**
     * [Admin] DELETE /admin/packages/:id - Elimina un paquete.
     * @param id El ID del paquete a eliminar.
     * @returns Observable<void>
     */
    deletePackage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // ---------------------------------------------------------------------------------
    // --- MÉTODOS AÑADIDOS PARA VALIDACIÓN DE PAGOS (USADOS POR UsersListComponent) ---
    // ---------------------------------------------------------------------------------

    /**
     * [Admin] PATCH /admin/packages/purchases/:purchaseId/validate - Valida una compra (Aprobada).
     * Asumo que la API tiene un endpoint dedicado a la validación de la compra.
     * @param purchaseId El ID de la compra a validar.
     * @returns Observable<PackagePurchase> La compra actualizada.
     */
    validatePurchase(purchaseId: number): Observable<PackagePurchase> {
        // Ejemplo de endpoint: PATCH /admin/packages/purchases/123/validate
        return this.http.patch<PackagePurchase>(`${this.apiUrl}/purchases/${purchaseId}/validate`, {});
    }

    /**
     * [Admin] PATCH /admin/packages/purchases/:purchaseId/reject - Rechaza una compra.
     * Asumo que la API tiene un endpoint dedicado al rechazo de la compra.
     * @param purchaseId El ID de la compra a rechazar.
     * @returns Observable<PackagePurchase> La compra actualizada.
     */
    rejectPurchase(purchaseId: number): Observable<PackagePurchase> {
        // Ejemplo de endpoint: PATCH /admin/packages/purchases/123/reject
        return this.http.patch<PackagePurchase>(`${this.apiUrl}/purchases/${purchaseId}/reject`, {});
    }
}


// --- SERVICIO DE USUARIO (PÚBLICO): /packages ---
@Injectable({
    providedIn: 'root'
})
export class UserPackageService {

    // Ruta base para endpoints públicos
    private apiUrl = 'http://localhost:3000/packages';

    constructor(private http: HttpClient) { }

    /**
     * [Público] GET /packages - Lista paquetes ACTIVOS.
     * @returns Observable<Package[]>
     */
    findAllActivePackages(): Observable<Package[]> {
        // Mapea a la ruta: GET /packages
        return this.http.get<Package[]>(this.apiUrl);
    }

    /**
     * [Público] GET /packages/:id - Ver un paquete ACTIVO.
     * @param id El ID del paquete.
     * @returns Observable<Package>
     */
    findOneActivePackage(id: number): Observable<Package> {
        // Mapea a la ruta: GET /packages/:id
        return this.http.get<Package>(`${this.apiUrl}/${id}`);
    }

    /**
     * [Usuario] POST /packages/:id/purchase - Enviar comprobante (archivo) y comprar.
     * Requiere token de usuario.
     * @param id El ID del paquete a comprar.
     * @param file El archivo de comprobante de pago (enviado en FormData).
     * @param notes Las notas opcionales del usuario (enviadas en FormData).
     * @returns Observable<PackagePurchase> El registro de compra creado.
     */
    purchasePackage(id: number, file: File, notes?: string): Observable<PackagePurchase> {
        const formData = new FormData();
        // 'proof_file' es el nombre que espera el @UseInterceptors(FileInterceptor('proof_file')) en el backend
        formData.append('proof_file', file, file.name);

        // Los campos adicionales (como notas) se anexan al FormData
        if (notes) {
            formData.append('notes', notes);
        }

        // Mapea a la ruta: POST /packages/:id/purchase
        return this.http.post<PackagePurchase>(`${this.apiUrl}/${id}/purchase`, formData);
    }

    /**
     * [Usuario] GET /package-purchases/my-purchases - Obtiene las compras del usuario logueado.
     * @returns Observable<PackagePurchase[]>
     */
    getMyPurchases(): Observable<PackagePurchase[]> {
        // Cambiamos a /package-purchases para evitar colisión con /packages/:id
        return this.http.get<PackagePurchase[]>('http://localhost:3000/package-purchases/my-purchases');
    }
}