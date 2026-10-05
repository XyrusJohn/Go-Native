import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CompanyDropdown({
  isOpen,
  onClose,
  onSelect,
  selectedId,
  companies,
}) {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-end"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-white rounded-t-3xl h-1/2 p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-atkinson-bold text-black">
              Select Truck Company
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={companies}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className="py-4 border-b border-slate-100 flex-row justify-between items-center"
              >
                <Text className="text-base font-atkinson text-slate-800">
                  {item.name}
                </Text>
                {selectedId === item.id && (
                  <Feather name="check" size={20} color="#2563eb" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
