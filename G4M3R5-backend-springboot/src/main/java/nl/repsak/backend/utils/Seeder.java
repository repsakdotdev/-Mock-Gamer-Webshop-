package nl.repsak.backend.utils;

import nl.repsak.backend.dao.*;
import nl.repsak.backend.models.*;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class Seeder {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PropertyRepository propertyRepository;
    private final PreviewImageRepository previewImageRepository;
    private final UserRepository customUserRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PasswordEncoder passwordEncoder; // <-- Nieuwe dependency

    public Seeder(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            PropertyRepository propertyRepository,
            PreviewImageRepository previewImageRepository,
            UserRepository customUserRepository,
            DeliveryAddressRepository deliveryAddressRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PasswordEncoder passwordEncoder ) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.propertyRepository = propertyRepository;
        this.previewImageRepository = previewImageRepository;
        this.customUserRepository = customUserRepository;
        this.deliveryAddressRepository = deliveryAddressRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener
    public void seed(ContextRefreshedEvent event) {
        this.seedDatabase();
    }

    private void seedDatabase() {
        // Seed categories and products if not already present
        seedCategoriesAndProducts();

        // Seed User data including admin account
        seedUsers();

        // Seed DeliveryAddress data
        seedDeliveryAddresses();

        // Seed Orders and OrderItems
        seedOrdersAndOrderItems();
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            Category keyboards = new Category("Toetsenborden", "Keyboards");
            Category mice = new Category("Gaming Muizen", "Gaming Mice");
            Category headsets = new Category("Koptelefoons", "Headsets");
            Category controllers = new Category("Controllers", "Controllers");
            Category monitors = new Category("Monitoren", "Monitors");
            Category mousepads = new Category("Muispads", "Mousepads");
            categoryRepository.saveAll(List.of(keyboards, mice, headsets, controllers, monitors, mousepads));

            // Existing products
            Product keyboard1 = new Product(
                    "Mechanisch Toetsenbord", "Mechanical Keyboard",
                    "RGB gaming toetsenbord met snelle respons", "RGB gaming keyboard with fast response",
                    99.99, "keyboard1.jpg", true, keyboards);

            Product keyboard2 = new Product(
                    "Compact Toetsenbord", "Compact Keyboard",
                    "Compact formaat zonder numpad, ideaal voor gamers", "Compact size without numpad, ideal for gamers",
                    79.99, "keyboard2.jpg", true, keyboards);

            Product mouse1 = new Product(
                    "Draadloze Gaming Muis", "Wireless Gaming Mouse",
                    "Snelle draadloze muis met programmeerbare knoppen", "Fast wireless mouse with programmable buttons",
                    59.99, "mouse1.jpg", true, mice);

            Product mouse2 = new Product(
                    "Ergonomische Gaming Muis", "Ergonomic Gaming Mouse",
                    "Ergonomisch ontwerp voor langdurig comfort", "Ergonomic design for long-term comfort",
                    69.99, "mouse2.jpg", true, mice);

            Product headset1 = new Product(
                    "Surround Gaming Headset", "Surround Gaming Headset",
                    "7.1 surround sound headset met ruisonderdrukking", "7.1 surround sound headset with noise cancelling",
                    79.99, "headset1.jpg", true, headsets);

            Product headset2 = new Product(
                    "Draadloze Headset", "Wireless Headset",
                    "Comfortabele draadloze headset met lange batterijduur", "Comfortable wireless headset with long battery life",
                    89.99, "headset2.jpg", true, headsets);

            Product controller1 = new Product(
                    "Pro Controller", "Pro Controller",
                    "Professionele controller met extra knoppen", "Professional controller with extra buttons",
                    69.99, "controller1.jpg", true, controllers);

            Product monitor1 = new Product(
                    "144Hz Gaming Monitor", "144Hz Gaming Monitor",
                    "Soepele gameplay met 144Hz en lage responstijd", "Smooth gameplay with 144Hz and low response time",
                    199.99, "monitor1.jpg", true, monitors);

            Product mousepad1 = new Product(
                    "XL Gaming Muispad", "XL Gaming Mousepad",
                    "Extra groot oppervlak voor maximale precisie", "Extra-large surface for maximum precision",
                    29.99, "mousepad1.jpg", true, mousepads);

            // New products
            Product keyboard3 = new Product(
                    "RGB Mechanisch Toetsenbord", "RGB Mechanical Keyboard",
                    "Full RGB mechanisch toetsenbord met aluminium frame", "Full RGB mechanical keyboard with aluminum frame",
                    129.99, "keyboard3.jpg", true, keyboards);

            Product mouse3 = new Product(
                    "MMO Gaming Muis", "MMO Gaming Mouse",
                    "12 programmeerbare knoppen voor MMO games", "12 programmable buttons for MMO games",
                    89.99, "mouse3.jpg", true, mice);

            Product headset3 = new Product(
                    "Premium Gaming Headset", "Premium Gaming Headset",
                    "Hoogwaardige audiokwaliteit met verstelbare microfoon", "High-quality audio with adjustable microphone",
                    119.99, "headset3.jpg", true, headsets);

            Product controller2 = new Product(
                    "Elite Controller", "Elite Controller",
                    "Premium controller met verwisselbare onderdelen", "Premium controller with interchangeable parts",
                    149.99, "controller2.jpg", true, controllers);

            Product monitor2 = new Product(
                    "UltraWide Monitor", "UltraWide Monitor",
                    "34-inch curved ultrawide monitor voor immersive gameplay", "34-inch curved ultrawide monitor for immersive gameplay",
                    499.99, "monitor2.jpg", true, monitors);

            Product mousepad2 = new Product(
                    "RGB Muispad", "RGB Mousepad",
                    "Muispad met randverlichting voor complete setup", "Mousepad with edge lighting for complete setup",
                    49.99, "mousepad2.jpg", true, mousepads);

            Product keyboard4 = new Product(
                    "Low-Profile Toetsenbord", "Low-Profile Keyboard",
                    "Ultra-dun ontwerp met low-profile switches", "Ultra-thin design with low-profile switches",
                    109.99, "keyboard4.jpg", true, keyboards);

            Product mouse4 = new Product(
                    "FPS Gaming Muis", "FPS Gaming Mouse",
                    "Lichtgewicht ontwerp voor competitieve FPS games", "Lightweight design for competitive FPS games",
                    79.99, "mouse4.jpg", true, mice);

            Product headset4 = new Product(
                    "Noise Cancelling Headset", "Noise Cancelling Headset",
                    "Actieve ruisonderdrukking voor volledige focus", "Active noise cancellation for complete focus",
                    139.99, "headset4.jpg", true, headsets);

            Product monitor3 = new Product(
                    "4K Gaming Monitor", "4K Gaming Monitor",
                    "27-inch 4K monitor met HDR voor scherpe visuals", "27-inch 4K monitor with HDR for sharp visuals",
                    699.99, "monitor3.jpg", true, monitors);

            productRepository.saveAll(List.of(
                    keyboard1, keyboard2, keyboard3, keyboard4,
                    mouse1, mouse2, mouse3, mouse4,
                    headset1, headset2, headset3, headset4,
                    controller1, controller2,
                    monitor1, monitor2, monitor3,
                    mousepad1, mousepad2
            ));

            // Properties for existing products (expanded to at least 3 per product)
            Property prop1 = new Property("RGB Verlichting", "RGB Lighting", "Ja", "Yes", keyboard1);
            Property prop2 = new Property("Switch Type", "Switch Type", "Cherry MX Red", "Cherry MX Red", keyboard1);
            Property prop3 = new Property("Aansluiting", "Connection", "USB-C", "USB-C", keyboard1);
            Property prop4 = new Property("Formaat", "Size", "TKL (Tenkeyless)", "TKL (Tenkeyless)", keyboard2);
            Property prop5 = new Property("Switch Type", "Switch Type", "Gateron Brown", "Gateron Brown", keyboard2);
            Property prop6 = new Property("RGB", "RGB", "Nee", "No", keyboard2);
            Property prop7 = new Property("DPI", "DPI", "16000", "16000", mouse1);
            Property prop8 = new Property("Connectie", "Connection", "Bluetooth & 2.4GHz", "Bluetooth & 2.4GHz", mouse1);
            Property prop9 = new Property("Knoppen", "Buttons", "8 programmeerbaar", "8 programmable", mouse1);
            Property prop10 = new Property("Gewicht", "Weight", "98g", "98g", mouse2);
            Property prop11 = new Property("Sensor", "Sensor", "PixArt PAW3370", "PixArt PAW3370", mouse2);
            Property prop12 = new Property("DPI", "DPI", "19000", "19000", mouse2);
            Property prop13 = new Property("Microfoon", "Microphone", "Ja, met noise cancelling", "Yes, with noise cancelling", headset1);
            Property prop14 = new Property("Draadloos", "Wireless", "Nee", "No", headset1);
            Property prop15 = new Property("Impedantie", "Impedance", "32Ω", "32Ω", headset1);
            Property prop16 = new Property("Draadloos", "Wireless", "Ja", "Yes", headset2);
            Property prop17 = new Property("Batterijduur", "Battery Life", "30 uur", "30 hours", headset2);
            Property prop18 = new Property("Gewicht", "Weight", "290g", "290g", headset2);
            Property prop19 = new Property("Platform", "Platform", "Multi-platform", "Multi-platform", controller1);
            Property prop20 = new Property("Knoppen", "Buttons", "4 extra programmeerbare knoppen", "4 extra programmable buttons", controller1);
            Property prop21 = new Property("Trilfeedback", "Rumble", "Ja", "Yes", controller1);
            Property prop22 = new Property("Responstijd", "Response Time", "1ms", "1ms", monitor1);
            Property prop23 = new Property("Refresh Rate", "Refresh Rate", "144Hz", "144Hz", monitor1);
            Property prop24 = new Property("Paneeltype", "Panel Type", "IPS", "IPS", monitor1);
            Property prop25 = new Property("Formaat", "Size", "XL", "XL", mousepad1);
            Property prop26 = new Property("Anti-slip", "Anti-slip", "Ja", "Yes", mousepad1);
            Property prop27 = new Property("Materiaal", "Material", "Stof", "Cloth", mousepad1);

            // Properties for new products
            Property prop28 = new Property("Frame", "Frame", "Aluminium", "Aluminum", keyboard3);
            Property prop29 = new Property("Switches", "Switches", "Gateron Yellow", "Gateron Yellow", keyboard3);
            Property prop30 = new Property("Keycaps", "Keycaps", "PBT double-shot", "PBT double-shot", keyboard3);
            Property prop31 = new Property("Knoppen", "Buttons", "12 programmeerbare knoppen", "12 programmable buttons", mouse3);
            Property prop32 = new Property("Gewicht", "Weight", "110g", "110g", mouse3);
            Property prop33 = new Property("DPI", "DPI", "16000", "16000", mouse3);
            Property prop34 = new Property("Driver Size", "Driver Size", "50mm", "50mm", headset3);
            Property prop35 = new Property("Microfoon", "Microphone", "Uitklapbaar", "Retractable", headset3);
            Property prop36 = new Property("Kabel", "Cable", "2m verwijderbaar", "2m detachable", headset3);
            Property prop37 = new Property("Verwisselbare delen", "Interchangeable Parts", "D-pad, analog sticks", "D-pad, analog sticks", controller2);
            Property prop38 = new Property("Gewicht", "Weight", "350g", "350g", controller2);
            Property prop39 = new Property("Backpaddles", "Backpaddles", "4 stuks", "4 pieces", controller2);
            Property prop40 = new Property("Curvature", "Curvature", "1500R", "1500R", monitor2);
            Property prop41 = new Property("Resolutie", "Resolution", "3440x1440", "3440x1440", monitor2);
            Property prop42 = new Property("Refresh Rate", "Refresh Rate", "120Hz", "120Hz", monitor2);
            Property prop43 = new Property("Verlichting", "Lighting", "RGB randverlichting", "RGB edge lighting", mousepad2);
            Property prop44 = new Property("Materiaal", "Material", "Hybride", "Hybrid", mousepad2);
            Property prop45 = new Property("Grootte", "Size", "900x400mm", "900x400mm", mousepad2);
            Property prop46 = new Property("Profiel", "Profile", "Ultra-dun (15mm)", "Ultra-thin (15mm)", keyboard4);
            Property prop47 = new Property("Switches", "Switches", "Kailh Choc", "Kailh Choc", keyboard4);
            Property prop48 = new Property("Aansluiting", "Connection", "USB-C & Bluetooth", "USB-C & Bluetooth", keyboard4);
            Property prop49 = new Property("Gewicht", "Weight", "65g", "65g", mouse4);
            Property prop50 = new Property("Sensor", "Sensor", "PixArt PAW3399", "PixArt PAW3399", mouse4);
            Property prop51 = new Property("Knoppen", "Buttons", "6 stuks", "6 pieces", mouse4);
            Property prop52 = new Property("Noise Cancelling", "Noise Cancelling", "Actief", "Active", headset4);
            Property prop53 = new Property("Draadloos", "Wireless", "Ja, met 2.4GHz dongle", "Yes, with 2.4GHz dongle", headset4);
            Property prop54 = new Property("Batterijduur", "Battery Life", "25 uur", "25 hours", headset4);
            Property prop55 = new Property("Resolutie", "Resolution", "3840x2160", "3840x2160", monitor3);
            Property prop56 = new Property("HDR", "HDR", "HDR600", "HDR600", monitor3);
            Property prop57 = new Property("Paneeltype", "Panel Type", "Nano-IPS", "Nano-IPS", monitor3);

            propertyRepository.saveAll(List.of(
                    prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8, prop9, prop10,
                    prop11, prop12, prop13, prop14, prop15, prop16, prop17, prop18, prop19, prop20,
                    prop21, prop22, prop23, prop24, prop25, prop26, prop27, prop28, prop29, prop30,
                    prop31, prop32, prop33, prop34, prop35, prop36, prop37, prop38, prop39, prop40,
                    prop41, prop42, prop43, prop44, prop45, prop46, prop47, prop48, prop49, prop50,
                    prop51, prop52, prop53, prop54, prop55, prop56, prop57
            ));

            // Preview images for existing products
            PreviewImage previewImage1 = new PreviewImage("https://i.imgur.com/vFGrp5t.png", keyboard1);
            PreviewImage previewImage2 = new PreviewImage("https://i.imgur.com/gR5N7s7.png", keyboard1);
            PreviewImage previewImage3 = new PreviewImage("https://i.imgur.com/HidMQbL.png", keyboard1);
            PreviewImage previewImage4 = new PreviewImage("https://i.imgur.com/W6CuUdq.png", keyboard2);
            PreviewImage previewImage5 = new PreviewImage("https://i.imgur.com/kEcpelD.png", keyboard2);
            PreviewImage previewImage6 = new PreviewImage("https://i.imgur.com/xA0k1oY.png", mouse1);
            PreviewImage previewImage7 = new PreviewImage("https://i.imgur.com/g7Ehh7P.png", mouse1);
            PreviewImage previewImage8 = new PreviewImage("https://i.imgur.com/4WyqZmO.png", mouse2);
            PreviewImage previewImage9 = new PreviewImage("https://i.imgur.com/aHEucJM.png", headset1);
            PreviewImage previewImage10 = new PreviewImage("https://i.imgur.com/rA297Fg.png", headset2);
            PreviewImage previewImage11 = new PreviewImage("https://i.imgur.com/9Yx95GG.png", controller1);
            PreviewImage previewImage12 = new PreviewImage("https://i.imgur.com/DwVAoyl.png", monitor1);
            PreviewImage previewImage13 = new PreviewImage("https://i.imgur.com/5NgYxzK.png", mousepad1);

            // Preview images for new products
            PreviewImage previewImage14 = new PreviewImage("https://media.s-bol.com/R5w7DYDp772w/qYDl8MR/550x197.jpg", keyboard3);
            PreviewImage previewImage15 = new PreviewImage("https://media.s-bol.com/qMD9mYGyoNDp/qYDl8MR/550x306.jpg", keyboard3);
            PreviewImage previewImage16 = new PreviewImage("https://redragonshop.com/cdn/shop/products/MMOGamingMouse_1.png?v=1661241457", mouse3);
            PreviewImage previewImage17 = new PreviewImage("https://lycangamer.com/cdn/shop/products/MOUSE.png?v=1667457738", mouse3);
            PreviewImage previewImage18 = new PreviewImage("https://png.pngtree.com/png-vector/20250209/ourmid/pngtree-modern-purple-and-golden-headphones-for-gaming-clipart-illustration-png-image_15429529.png", headset3);
            PreviewImage previewImage19 = new PreviewImage("https://png.pngtree.com/png-vector/20250209/ourmid/pngtree-premium-purple-and-golden-gaming-headphones-clipart-illustration-png-image_15429526.png", headset3);
            PreviewImage previewImage20 = new PreviewImage("https://moddedzone.com/cdn/shop/files/starfield_elite2.webp?v=1726772494", controller2);
            PreviewImage previewImage21 = new PreviewImage("https://gameshort.in/wp-content/uploads/2024/05/Xbox-One-Official-Elite-White-Wireless-Controller.png", controller2);
            PreviewImage previewImage22 = new PreviewImage("https://png.pngtree.com/png-vector/20240716/ourmid/pngtree-ultra-wide-widescreen-monitor-with-high-resolution-display-for-enhanced-productivity-png-image_13120553.png", monitor2);
            PreviewImage previewImage23 = new PreviewImage("https://png.pngtree.com/png-vector/20240801/ourmid/pngtree-widescreen-monitor-png-image_13300839.png", monitor2);
            PreviewImage previewImage24 = new PreviewImage("https://i5.walmartimages.com/asr/06f03354-fbcc-4884-973a-ce33ddf55b77.d4cacce54966aad40654e4a3f7c7550d.png?odnHeight=768&odnWidth=768&odnBg=FFFFFF", mousepad2);
            PreviewImage previewImage25 = new PreviewImage("https://cdn.shopify.com/s/files/1/0280/3931/5529/files/IMG_7727.png?v=1739932609&width=3840&quality=75", keyboard4);
            PreviewImage previewImage26 = new PreviewImage("https://iqonmauritius.com/wp-content/uploads/2018/05/G402-HYPERION-FURY-ULTRA-FAST-FPS-GAMING-MOUSE.png", mouse4);
            PreviewImage previewImage27 = new PreviewImage("https://png.pngtree.com/png-vector/20240918/ourmid/pngtree-noise-cancelling-headphones-on-white-background-png-image_13860339.png", headset4);
            PreviewImage previewImage28 = new PreviewImage("https://s3.eu-central-1.amazonaws.com/aoc.production.eu/public/media/2021/10/aoc-u28g2xu-hero-visual-2-big.png", monitor3);

            previewImageRepository.saveAll(List.of(
                    previewImage1, previewImage2, previewImage3, previewImage4, previewImage5,
                    previewImage6, previewImage7, previewImage8, previewImage9, previewImage10,
                    previewImage11, previewImage12, previewImage13, previewImage14, previewImage15,
                    previewImage16, previewImage17, previewImage18, previewImage19, previewImage20,
                    previewImage21, previewImage22, previewImage23, previewImage24, previewImage25,
                    previewImage26, previewImage27, previewImage28
            ));
        }
    }
    private void seedUsers() {
        if (customUserRepository.count() == 0) {
            // Create admin user
            // Seeder.java
            User admin = new User("admin", passwordEncoder.encode("sterk-wachtwoord-123"));
            admin.setEmail("admin@example.com");
            admin.setAdmin(true);

            // Create regular users
            User user1 = new User("janwillem", passwordEncoder.encode("password123"));
            user1.setEmail("jan.willem@example.com");
            user1.setAdmin(false);
            user1.setInternationalUser(false);

            User user2 = new User("sarahsmith", passwordEncoder.encode("secure456"));
            user2.setEmail("sarah.smith@example.com");
            user2.setAdmin(false);
            user2.setInternationalUser(true);

            User user3 = new User("davidbrown", passwordEncoder.encode("gamer789"));
            user3.setEmail("david.brown@example.com");
            user3.setAdmin(false);
            user3.setInternationalUser(false);

            customUserRepository.saveAll(List.of(admin, user1, user2, user3));
        }
    }

    private void seedDeliveryAddresses() {
        if (deliveryAddressRepository.count() == 0) {
            DeliveryAddress address1 = new DeliveryAddress();
            address1.setZipCode("1234 AB");
            address1.setCity("Amsterdam");
            address1.setStreet("Damstraat");
            address1.setHouseNumber("10A");
            address1.setReceiverName("Jan Willem de Vries");

            DeliveryAddress address2 = new DeliveryAddress();
            address2.setZipCode("5678 CD");
            address2.setCity("Rotterdam");
            address2.setStreet("Coolsingel");
            address2.setHouseNumber("42");
            address2.setReceiverName("Sarah Smith");

            DeliveryAddress address3 = new DeliveryAddress();
            address3.setZipCode("9012 EF");
            address3.setCity("Utrecht");
            address3.setStreet("Oudegracht");
            address3.setHouseNumber("15");
            address3.setReceiverName("David Brown");

            deliveryAddressRepository.saveAll(List.of(address1, address2, address3));
        }
    }

    private void seedOrdersAndOrderItems() {
        if (orderRepository.count() == 0) {
            // Get saved entities
            List<User> users = (List<User>) customUserRepository.findAll();
            List<DeliveryAddress> addresses = (List<DeliveryAddress>) deliveryAddressRepository.findAll();
            List<Product> products = (List<Product>) productRepository.findAll();

            if (!users.isEmpty() && !addresses.isEmpty() && !products.isEmpty()) {
                // Create some orders
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

                // Order 1
                Order order1 = new Order();
                order1.setUser(users.get(1)); // First regular user
                order1.setOrderDate(LocalDateTime.now().minusDays(10));
                order1.setDeliveryAddress(addresses.get(0));
                order1.setTotalPrice(99 + 60);
                orderRepository.save(order1);

                // Order items for order 1
                OrderItem item1 = createOrderItem(products.get(0), 1, order1); // Keyboard
                OrderItem item2 = createOrderItem(products.get(2), 1, order1); // Mouse
                orderItemRepository.saveAll(List.of(item1, item2));

                // Order 2
                Order order2 = new Order();
                order2.setUser(users.get(2)); // Second regular user
                order2.setOrderDate(LocalDateTime.now().minusDays(5));
                order2.setDeliveryAddress(addresses.get(1));
                order2.setTotalPrice(80 + 90);
                orderRepository.save(order2);

                // Order items for order 2
                OrderItem item3 = createOrderItem(products.get(1), 1, order2); // Keyboard2
                OrderItem item4 = createOrderItem(products.get(5), 1, order2); // Headset2
                orderItemRepository.saveAll(List.of(item3, item4));

                // Order 3
                Order order3 = new Order();
                order3.setUser(users.get(1)); // First regular user again
                order3.setOrderDate(LocalDateTime.now().minusDays(2));
                order3.setDeliveryAddress(addresses.get(0));
                order3.setTotalPrice(200);
                orderRepository.save(order3);

                // Order items for order 3
                OrderItem item5 = createOrderItem(products.get(7), 1, order3); // Monitor
                orderItemRepository.save(item5);
            }
        }
    }

    // Helper method to create OrderItem since there's no full constructor
    private OrderItem createOrderItem(Product product, int quantity, Order order) {
        OrderItem item = new OrderItem();
        try {
            // Using reflection to set private fields since there are no setters
            java.lang.reflect.Field quantityField = OrderItem.class.getDeclaredField("quantity");
            quantityField.setAccessible(true);
            quantityField.set(item, quantity);

            // Use available setters
            item.setProduct(product);
            item.setOrder(order);

            return item;
        } catch (Exception e) {
            System.out.println("Error creating OrderItem: " + e.getMessage());
            return null;
        }
    }
}