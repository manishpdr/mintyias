import React, { useState } from 'react';
import apiClient from '../api/axios';

interface OrderItem {
  name: string;
  Order: string;
}

const Orders: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<OrderItem[]>([{ name: '', Order: '' }]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    setItems((currentItems) =>
      currentItems.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((currentItems) => [...currentItems, { name: '', Order: '' }]);
  };

  const removeItem = (index: number) => {
    setItems((currentItems) => currentItems.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    if (!customerName.trim()) {
      setError('Customer name is required.');
      return false;
    }
    if (items.length === 0) {
      setError('At least one item is required.');
      return false;
    }
    for (const item of items) {
      if (!item.name.trim() || !item.Order.trim()) {
        setError('All item fields must be filled.');
        return false;
      }
    }
    return true;
  };

  const submitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName,
        items,
      };

      const response = await apiClient.post('/Orders', payload);

      setStatus('Order submitted successfully.');
      setError(null);
      setCustomerName('');
      setItems([{ name: '', Order: '' }]);
      console.log('Order response:', response.data);
    } catch (err: unknown) {
      console.error('Order submission failed:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit order.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: 760, margin: '32px auto', padding: 24 }}>
      <h2>Create New Order</h2>
      <p>Submit a request with customer name and one or more items.</p>
      <form onSubmit={submitOrder}>
        <div className="form-group">
          <label htmlFor="customerName">Customer Name *</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <h3>Items</h3>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr auto',
                gap: '16px',
                alignItems: 'end',
                marginBottom: 16,
              }}
            >
              <div className="form-group">
                <label htmlFor={`item-name-${index}`}>Item Name *</label>
                <input
                  id={`item-name-${index}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  placeholder="Item name"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`item-order-${index}`}>Order *</label>
                <input
                  id={`item-order-${index}`}
                  type="text"
                  value={item.Order}
                  onChange={(e) => handleItemChange(index, 'Order', e.target.value)}
                  placeholder="Order value"
                />
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ height: 40, marginBottom: 4 }}
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addItem} style={{ marginBottom: 24 }}>
            Add Item
          </button>
        </div>

        {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}
        {status && <div style={{ color: '#2ecc71', marginBottom: 16 }}>{status}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};

export default Orders;
