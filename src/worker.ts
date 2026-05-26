export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta: any;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    };

    const errorResponse = (message: string, status = 400) => {
      return jsonResponse({ error: message }, status);
    };

    const checkAuth = (req: Request) => {
      const authHeader = req.headers.get('Authorization');
      const expectedPassword = env.ADMIN_PASSWORD || 'DRMOBILES@2025';
      if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
        return false;
      }
      return true;
    };

    try {
      // ----------------------------------------------------
      // PUBLIC PRODUCT APIs
      // ----------------------------------------------------
      if (url.pathname === '/api/products' && method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM products WHERE status = "active" ORDER BY createdAt DESC').all();
        return jsonResponse(results);
      }

      if (url.pathname.match(/^\/api\/products\/([^\/]+)$/) && method === 'GET') {
        const match = url.pathname.match(/^\/api\/products\/([^\/]+)$/);
        const id = match ? match[1] : '';
        const product = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
        if (!product) return errorResponse('Product not found', 404);
        return jsonResponse(product);
      }

      // ----------------------------------------------------
      // ADMIN PRODUCT APIs
      // ----------------------------------------------------
      if (url.pathname.startsWith('/api/admin/products')) {
        if (!checkAuth(request)) return errorResponse('Unauthorized', 401);

        if (url.pathname === '/api/admin/products' && method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY createdAt DESC').all();
          return jsonResponse(results);
        }

        if (url.pathname === '/api/admin/products' && method === 'POST') {
          const body: any = await request.json();
          const id = crypto.randomUUID();
          await env.DB.prepare(
            `INSERT INTO products (id, name, brand, category, price, originalPrice, stock, description, image, offerBadge, status, createdAt, updatedAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
          ).bind(
            id, body.name, body.brand, body.category, body.price, body.originalPrice, body.stock, body.description, body.image, body.offerBadge, body.status || 'active'
          ).run();
          return jsonResponse({ id, success: true }, 201);
        }

        const match = url.pathname.match(/^\/api\/admin\/products\/([^\/]+)$/);
        if (match) {
          const id = match[1];
          if (method === 'PUT') {
            const body: any = await request.json();
            await env.DB.prepare(
              `UPDATE products SET name=?, brand=?, category=?, price=?, originalPrice=?, stock=?, description=?, image=?, offerBadge=?, status=?, updatedAt=datetime('now') WHERE id=?`
            ).bind(
              body.name, body.brand, body.category, body.price, body.originalPrice, body.stock, body.description, body.image, body.offerBadge, body.status || 'active', id
            ).run();
            return jsonResponse({ success: true });
          }
          if (method === 'DELETE') {
            await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
            return jsonResponse({ success: true });
          }
        }
      }

      // ----------------------------------------------------
      // PUBLIC ORDER APIs
      // ----------------------------------------------------
      if (url.pathname === '/api/orders' && method === 'POST') {
        const body: any = await request.json();
        const id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await env.DB.prepare(
          `INSERT INTO orders (id, customerName, email, phone, address, city, pincode, notes, items, subtotal, total, paymentMethod, paymentStatus, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
        ).bind(
          id, body.customerName, body.email || '', body.phone, body.address, body.city || '', body.pincode || '', body.notes || '',
          JSON.stringify(body.items), body.subtotal, body.total, body.paymentMethod, body.paymentStatus || 'pending'
        ).run();
        return jsonResponse({ id, success: true }, 201);
      }

      if (url.pathname === '/api/orders/track' && method === 'GET') {
        const phone = url.searchParams.get('phone');
        if (!phone) return errorResponse('Phone number required');
        const { results } = await env.DB.prepare('SELECT * FROM orders WHERE phone = ? ORDER BY createdAt DESC').bind(phone).all();
        return jsonResponse(results);
      }

      // ----------------------------------------------------
      // ADMIN ORDER APIs
      // ----------------------------------------------------
      if (url.pathname.startsWith('/api/admin/orders')) {
        if (!checkAuth(request)) return errorResponse('Unauthorized', 401);

        if (url.pathname === '/api/admin/orders' && method === 'GET') {
          const { results } = await env.DB.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
          return jsonResponse(results);
        }

        const match = url.pathname.match(/^\/api\/admin\/orders\/([^\/]+)\/status$/);
        if (match && method === 'PATCH') {
          const id = match[1];
          const body: any = await request.json();
          await env.DB.prepare(`UPDATE orders SET paymentStatus=?, updatedAt=datetime('now') WHERE id=?`)
            .bind(body.paymentStatus, id).run();
          return jsonResponse({ success: true });
        }
      }

      // ----------------------------------------------------
      // RAZORPAY APIs
      // ----------------------------------------------------
      if (url.pathname === '/api/razorpay/create-order' && method === 'POST') {
        const body: any = await request.json();
        const { amount, receipt } = body;
        
        if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
          return errorResponse('Razorpay not configured on backend', 500);
        }

        const credentials = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
            receipt: receipt
          })
        });

        const data = await response.json();
        return jsonResponse(data, response.status);
      }

      if (url.pathname === '/api/razorpay/verify-payment' && method === 'POST') {
        const body: any = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

        if (!env.RAZORPAY_KEY_SECRET) return errorResponse('Razorpay secret not configured', 500);

        // Generate HMAC SHA256 signature
        const encoder = new TextEncoder();
        const data = encoder.encode(razorpay_order_id + "|" + razorpay_payment_id);
        const key = await crypto.subtle.importKey(
          'raw',
          encoder.encode(env.RAZORPAY_KEY_SECRET),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const expectedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (expectedSignature === razorpay_signature) {
          // Update order status in DB
          if (orderId) {
            await env.DB.prepare(`UPDATE orders SET paymentStatus='paid', razorpayOrderId=?, razorpayPaymentId=?, updatedAt=datetime('now') WHERE id=?`)
              .bind(razorpay_order_id, razorpay_payment_id, orderId).run();
          }
          return jsonResponse({ success: true, verified: true });
        } else {
          if (orderId) {
            await env.DB.prepare(`UPDATE orders SET paymentStatus='failed', updatedAt=datetime('now') WHERE id=?`)
              .bind(orderId).run();
          }
          return errorResponse('Signature verification failed', 400);
        }
      }

      // If no API route matched, return a 404 (or the asset fallback will happen automatically with Pages)
      // Since this site is hosted on Pages, requests not intercepted here will fall through to static assets.
      return new Response('Not found', { status: 404 });

    } catch (error: any) {
      return errorResponse(error.message || 'Internal Server Error', 500);
    }
  },
};
