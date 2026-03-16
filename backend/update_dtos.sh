sed -i 's/private Double totalAmount;/private Double totalAmount;\n    private Double pricePerSeat;/g' /home/pedro/Downloads/vanvan-es/backend/src/main/java/com/vanvan/dto/TripDetailsDTO.java
sed -i 's/public static TripDetailsDTO fromEntity(Trip trip) {/public static TripDetailsDTO fromEntity(Trip trip, Double pricePerSeat) {/g' /home/pedro/Downloads/vanvan-es/backend/src/main/java/com/vanvan/dto/TripDetailsDTO.java
sed -i 's/trip.getStatus()/trip.getStatus(),\n                pricePerSeat/g' /home/pedro/Downloads/vanvan-es/backend/src/main/java/com/vanvan/dto/TripDetailsDTO.java
