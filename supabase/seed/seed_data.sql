-- Insert brands
INSERT INTO public.brands (name, slug, logo_url, distributor_name) VALUES
('Suzuki', 'suzuki', 'https://placehold.co/100x40/0f172a/ffffff?text=Suzuki', 'Saz Motors'),
('Toyota', 'toyota', 'https://placehold.co/100x40/0f172a/ffffff?text=Toyota', 'Toyota Nepal'),
('Hyundai', 'hyundai', 'https://placehold.co/100x40/0f172a/ffffff?text=Hyundai', 'Hyundai Nepal'),
('Kia', 'kia', 'https://placehold.co/100x40/0f172a/ffffff?text=Kia', 'Kia Nepal'),
('MG', 'mg', 'https://placehold.co/100x40/0f172a/ffffff?text=MG', 'MG Nepal'),
('Honda', 'honda', 'https://placehold.co/100x40/0f172a/ffffff?text=Honda', 'Honda Nepal'),
('Nissan', 'nissan', 'https://placehold.co/100x40/0f172a/ffffff?text=Nissan', 'Nissan Nepal'),
('BYD', 'byd', 'https://placehold.co/100x40/0f172a/ffffff?text=BYD', 'BYD Nepal');

-- Insert cars
INSERT INTO public.cars (name, slug, brand, model, year, variant, ex_showroom_price, on_road_price, fuel_type, transmission, engine_cc, mileage_kmpl, seating, category, is_electric, is_featured, is_new, images) VALUES
('Swift', 'suzuki-swift', 'Suzuki', 'Swift', 2025, 'VXI MT', 2650000, 2950000, 'Petrol', 'Manual', 1197, 23.5, 5, 'Hatchback', false, true, true, ARRAY['https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=600&h=400']),
('Fortuner', 'toyota-fortuner', 'Toyota', 'Fortuner', 2025, '2.8 GD-6 4WD', 11500000, 12800000, 'Diesel', 'Automatic', 2755, 12.0, 7, 'SUV', false, true, true, ARRAY['https://images.unsplash.com/photo-1549399542-7e7f8c7a5e3d?auto=format&fit=crop&w=600&h=400']),
('Creta', 'hyundai-creta', 'Hyundai', 'Creta', 2025, 'SX(O) Turbo DCT', 5200000, 5800000, 'Petrol', 'Automatic', 1482, 16.8, 5, 'SUV', false, true, true, ARRAY['https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&h=400']),
('Sonet', 'kia-sonet', 'Kia', 'Sonet', 2025, 'HTX Plus', 4100000, 4600000, 'Petrol', 'Automatic', 1493, 18.2, 5, 'SUV', false, false, true, ARRAY['https://images.unsplash.com/photo-1596779911828-609b0b4e8c7b?auto=format&fit=crop&w=600&h=400']),
('ZS EV', 'mg-zs-ev', 'MG', 'ZS EV', 2025, 'Excite', 4750000, 5200000, 'Electric', 'Automatic', 0, 0, 5, 'SUV', true, true, true, ARRAY['https://images.unsplash.com/photo-1617814076367-b759c7d7e7e1?auto=format&fit=crop&w=600&h=400']),
('City', 'honda-city', 'Honda', 'City', 2025, 'SV', 3850000, 4300000, 'Petrol', 'Manual', 1498, 17.8, 5, 'Sedan', false, false, true, ARRAY['https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&h=400']);