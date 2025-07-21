import React, { useEffect, useState } from 'react';
import { createInputGroupOrder, joinInputGroupOrder, getInputGroupOrders, updateInputGroupOrderStatus } from '@/services/inputGroupOrderService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const GroupInputOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [inputType, setInputType] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    getInputGroupOrders().then(({ data }) => setOrders(data || []));
  }, []);

  const handleExpressNeed = async () => {
    await createInputGroupOrder({ input_type: inputType, quantity });
    getInputGroupOrders().then(({ data }) => setOrders(data || []));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Group Purchasing for Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input type="text" placeholder="Input Type" value={inputType} onChange={e => setInputType(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            <Button onClick={handleExpressNeed}>Express Need</Button>
          </div>
          <ul>
            {orders.map(order => (
              <li key={order.id}>{order.input_type} - {order.quantity} units (Status: {order.status})</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupInputOrders;
