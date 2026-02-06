import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  // KeyboardAvoidingView,
  Modal,
  ScrollView,
  // Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;
export default function ProfileScreen() {
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(2000, 0, 1));
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);


  const router = useRouter();
  const params = useLocalSearchParams();
  // const base64ToUri = (base64: string) => {
  //   return `data:image/jpeg;base64,${base64}`;
  // };

useEffect(() => {
  if (initialized) return;
  if (!params?.result) return;

  try {
    const data = JSON.parse(params.result as string);

    setName(data.name || "");
    setEmail(data.email || "");
    setMobile(data.mobile || "");
    setGender(data.gender || "");

    if (data.dob) {
      const parsed = new Date(data.dob);
      setDob(parsed);
      setTempDate(parsed);
    }

    if (data.imageData) {
      setImage(`data:image/jpeg;base64,${data.imageData}`);
    }

    setInitialized(true); // <-- mark as initialized
  } catch (e) {
    console.log("Profile param parse error:", e);
  }
}, [params?.result, initialized]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months start from 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };


const pickImage = async () => {
  Alert.alert("Profile Picture", "Choose an option", [
    {
      text: "Camera",
      onPress: async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission required", "Please allow camera access.");
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
      },
    },
    {
      text: "Gallery",
      onPress: async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission required", "Please allow gallery access.");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
      },
    },
    {
      text: "Remove",
      onPress: () => handleRemoveImage(),
      style: "destructive",
    },
    { text: "Cancel", style: "cancel" },
  ]);
};


  const handleUpdate = async () => {
    try {
      console.log("INSIDE handleUpdate function")
      setLoading(true);
      const token = await SecureStore.getItemAsync("auth_token");

      const formData = new FormData();
      const formattedDob = dob
        ? `${String(dob.getDate()).padStart(2, "0")}/${String(dob.getMonth() + 1).padStart(2, "0")}/${dob.getFullYear()}`
        : null;
        const profileData = {
          name,
          email,
          mobile,
          gender,
          dob: formattedDob,
        };
      formData.append("data", JSON.stringify(profileData));
      if (image) {
        formData.append("image", {
          uri: image,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(`${API_BASE_URL}/updateProfile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      Alert.alert("Success", "Profile updated");

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Update failed");
    } finally {
      setLoading(false);
    }
  };

const handleRemoveImage = async () => {
  console.log("Inside handleRemoveImage")
  try {
    const token = await SecureStore.getItemAsync("auth_token");
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/delete/profileImage`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to remove image");
    setImage(null);
    // Alert.alert("Success", "Profile picture removed");
  } catch (err) {
    console.log(err);
    // Alert.alert("Error", "Could not remove profile picture");
  }
};


  return (
  // <KeyboardAvoidingView
  //   behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.push("/account")} />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* AVATAR */}
      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.avatar}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person-outline" size={42} color="#777" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.addPhoto}>{image ? "Change Profile Picture" : "Add Profile Picture"}</Text>
        </TouchableOpacity>
      </View>

      {/* GENDER */}
      <View style={styles.genderRow}>
        {["Miss", "Mr"].map(item => (
          <TouchableOpacity
            key={item}
            style={styles.radio}
            onPress={() => setGender(item)}
          >
            <View style={[styles.circle, gender === item && styles.selected]} />
            <Text style={styles.radioText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* INPUTS */}
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={text => setName(text)} style={styles.input} />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput value={mobile} onChangeText={text => setMobile(text)} style={styles.input} keyboardType="phone-pad"/>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.label}>Email</Text>
        </View>
        <TextInput value={email} editable={false}  style={styles.input} />
      </View>

      {/* DOB FIELD */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowPicker(true)}
      >
        <Text style={dob ? styles.input : styles.placeholder}>
          {dob ? formatDate(dob) : "Enter your DOB"}
        </Text>
      </TouchableOpacity>

      {/* BOTTOM DATE PICKER */}
      <Modal transparent animationType="slide" visible={showPicker}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>

            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => {
                setDob(null);
                setShowPicker(false);
              }}>
                <Text style={styles.clear}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setDob(tempDate);
                setShowPicker(false);
              }}>
                <Text style={styles.done}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(e, d) => d && setTempDate(d)}
                textColor="#000000"
                style={{ width: "100%", height: 250 }}
              />
            </View>

          </View>
        </View>
      </Modal>

      {/* UPDATE */}
      <TouchableOpacity style={styles.update} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.updateText}>
          {loading ? "Updating..." : "Update"}
        </Text>
      </TouchableOpacity>
</ScrollView>
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:"#F7F8FA",
  paddingHorizontal:16
},

header:{
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:20
},

headerTitle:{
  fontSize:18,
  fontWeight:"600"
},

avatarWrapper:{
  alignItems:"center",
  marginBottom:20
},

avatar:{
  height:90,
  width:90,
  borderRadius:45,
  backgroundColor:"#E9EDF2",
  alignItems:"center",
  justifyContent:"center",
  marginBottom:10
},

avatarImg:{
  width:"100%",
  height:"100%",
  borderRadius:45
},

addPhoto:{
  color:"#E17B82",
  fontWeight:"600",
  fontSize:16
},

genderRow:{
  flexDirection:"row",
  gap:30,
  marginBottom:20
},

radio:{
  flexDirection:"row",
  alignItems:"center",
  gap:8
},

circle:{
  height:18,
  width:18,
  borderRadius:9,
  borderWidth:2,
  borderColor:"#999"
},

selected:{
  backgroundColor:"#E17B82",
  borderColor:"#E17B82"
},

radioText:{
  fontSize:16
},

card:{
  backgroundColor:"#EEF1F4",
  borderRadius:14,
  padding:14,
  marginBottom:14
},

label:{
  color:"#7A869A",
  fontSize:13,
  marginBottom:4
},

input:{
  fontSize:16,
  fontWeight:"500"
},

placeholder:{
  color:"#9AA4B2",
  fontSize:16
},

verified:{
  color:"#22A45D",
  fontWeight:"600"
},

update:{
  marginTop:"auto",
  backgroundColor:"#DADDE2",
  padding:16,
  borderRadius:12,
  alignItems:"center",
  marginBottom:20
},

updateText:{
  color:"#E91E63",
  fontWeight:"700",
  fontSize:16
},

modalOverlay:{
  flex:1,
  justifyContent:"flex-end",
  backgroundColor:"rgba(0,0,0,0.3)"
},

pickerContainer:{
  backgroundColor:"#fff",
  borderTopLeftRadius:18,
  borderTopRightRadius:18,
  paddingTop:12
},

pickerWrapper: {
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
},

pickerHeader:{
  flexDirection:"row",
  justifyContent:"space-between",
  paddingHorizontal:16,
  paddingBottom:10,
  borderBottomWidth:1,
  borderColor:"#eee"
},

clear:{
  color:"#E91E63",
  fontSize:16,
  fontWeight:"600"
},

done:{
  color:"#E91E63",
  fontSize:16,
  fontWeight:"600"
}

});
