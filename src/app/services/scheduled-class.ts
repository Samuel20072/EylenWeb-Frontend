/**
 * Interfaces de Tipado
 * Nota: Estas interfaces deben coincidir con tus DTOs y entidades reales del backend.
 */

// Interfaz para la entidad completa (o la respuesta de la API)
interface ScheduledClass {
  id: number;
  date: string; // ISO Date string
  time: string;
  // Añadir otras propiedades de tu ScheduledClass (e.g., coach, capacity, etc.)
  [key: string]: any; 
}

// DTO para la creación de una clase
interface CreateScheduledClassDto {
  date: string;
  time: string;
  // Añadir campos de creación
  [key: string]: any;
}

// DTO para la actualización de una clase
// 'Partial' indica que todos los campos son opcionales
type UpdateScheduledClassDto = Partial<CreateScheduledClassDto>;


/**
 * Servicio de Cliente (Frontend) para la gestión de Clases Programadas
 */
export class ScheduledClassesService {
  // Asegúrate de reemplazar esta URL base con la dirección de tu API
  private readonly baseUrl = 'http://localhost:3000/scheduled-classes'; 
  
  // Puedes pasar la URL base como argumento si es necesario para diferentes entornos
  // constructor(private readonly baseUrl: string) {}

  private async request<T>(
    url: string,
    method: string,
    body?: any,
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // Agrega tu token de autenticación si es necesario
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
    };

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, config);

      // Si la respuesta es 204 No Content (como en DELETE), retorna un objeto vacío
      if (response.status === 204) {
        return {} as T;
      }
      
      // Manejar errores HTTP
      if (!response.ok) {
        // Intenta obtener el mensaje de error del cuerpo de la respuesta
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Error en la solicitud de API');
      }

      // Parsea el cuerpo JSON
      return response.json() as Promise<T>;

    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // POST /scheduled-classes
  async create(dto: CreateScheduledClassDto): Promise<ScheduledClass> {
    const url = this.baseUrl;
    return this.request<ScheduledClass>(url, 'POST', dto);
  }

  // GET /scheduled-classes
  async findAll(): Promise<ScheduledClass[]> {
    const url = this.baseUrl;
    return this.request<ScheduledClass[]>(url, 'GET');
  }

  // GET /scheduled-classes/:id
  async findOne(id: number): Promise<ScheduledClass> {
    const url = `${this.baseUrl}/${id}`;
    return this.request<ScheduledClass>(url, 'GET');
  }

  // PATCH /scheduled-classes/:id
  async update(id: number, dto: UpdateScheduledClassDto): Promise<ScheduledClass> {
    const url = `${this.baseUrl}/${id}`;
    return this.request<ScheduledClass>(url, 'PATCH', dto);
  }

  // DELETE /scheduled-classes/:id
  async remove(id: number): Promise<void> {
    const url = `${this.baseUrl}/${id}`;
    // El método request devolverá un Promise<void> para 204 No Content
    return this.request<void>(url, 'DELETE');
  }
}