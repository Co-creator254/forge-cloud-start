import React, { useEffect, useState } from 'react';
import { subscribeBox, getSubscriptionBoxes, updateSubscriptionBox, getBoxDeliveries, markBoxDeliveryDelivered } from '@/services/f2cSubscriptionService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const F2CSubscriptionBoxes: React.FC = () => {
  const [boxType, setBoxType] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [farmerId, setFarmerId] = useState('');
  const [boxes, setBoxes] = useState<any[]>([]);
  const [consumerId, setConsumerId] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState('');
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    if (consumerId) getSubscriptionBoxes(consumerId).then(({ data }) => setBoxes(data || []));
    if (selectedBoxId) getBoxDeliveries(selectedBoxId).then(({ data }) => setDeliveries(data || []));
  }, [consumerId, selectedBoxId]);

  const handleSubscribe = async () => {
    await subscribeBox({ consumer_id: consumerId, farmer_id: farmerId, box_type: boxType, frequency });
    getSubscriptionBoxes(consumerId).then(({ data }) => setBoxes(data || []));
  };

  const handleMarkDelivered = async (delivery_id) => {
    await markBoxDeliveryDelivered(delivery_id);
    getBoxDeliveries(selectedBoxId).then(({ data }) => setDeliveries(data || []));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Direct Farmer-to-Consumer Subscription Boxes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input type="text" placeholder="Consumer ID" value={consumerId} onChange={e => setConsumerId(e.target.value)} />
            <input type="text" placeholder="Farmer ID" value={farmerId} onChange={e => setFarmerId(e.target.value)} />
            <input type="text" placeholder="Box Type" value={boxType} onChange={e => setBoxType(e.target.value)} />
            <select value={frequency} onChange={e => setFrequency(e.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
            </select>
            <Button onClick={handleSubscribe}>Subscribe</Button>
          </div>
          <ul>
            {boxes.map(box => (
              <li key={box.id}>{box.box_type} ({box.frequency}) Farmer: {box.farmer_id} Status: {box.status} <Button onClick={() => setSelectedBoxId(box.id)}>View Deliveries</Button></li>
            ))}
          </ul>
          <div className="mt-6 mb-4">
            <ul>
              {deliveries.map(delivery => (
                <li key={delivery.id}>Delivery: {delivery.delivery_date} Delivered: {delivery.delivered ? '✔️' : <Button onClick={() => handleMarkDelivered(delivery.id)}>Mark Delivered</Button>}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default F2CSubscriptionBoxes;
