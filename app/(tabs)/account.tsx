import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function AccountScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; imageData?: string }>({});
  useEffect(() => {
    loadSetting();
    loadProfile();
  }, []);


  const loadSetting = async () => {
    const saved = await SecureStore.getItemAsync("notifications_enabled");
    if (saved !== null) setEnabled(saved === "true");
  };

    const loadProfile = async () => {
    const token = await SecureStore.getItemAsync("auth_token");
    try {
      const res = await fetch(`${API_BASE_URL}/getProfile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUser(data); // { name, email, avatar? }
    } catch (err) {
      console.error(err);
    }
  };


  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        alert("Notification permission denied");
        return;
      }
    }

    setEnabled(value);
    await SecureStore.setItemAsync("notifications_enabled", String(value));
  };

  const getScanHistory = async () => {
    const token = await SecureStore.getItemAsync("auth_token");
  
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Scan failed");
  
      const data = await res.json();
      console.log("DATA",data)
  
      // ✅ Navigate AFTER analysis
      router.push({
        pathname: "/history",
        params: {
          result: JSON.stringify(data),
        },
      });
  
    } catch (error) {
      console.error(error);
    }
  };

  const getInitial = () => {
    if (user.name && user.name.length > 0) return user.name[0].toUpperCase();
    if (user.email && user.email.length > 0) return user.email[0].toUpperCase();
  };

    const getProfileDetails = async () => {
    const token = await SecureStore.getItemAsync("auth_token");
  
    try {
      const res = await fetch(`${API_BASE_URL}/getProfile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      console.log("DATA",data)
  
      // ✅ Navigate AFTER analysis
      router.push({
        pathname: "/ProfileScreen",
        params: {
          result: JSON.stringify(data),
        },
      });
  
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {user.name?.split(" ")[0]} 👋</Text>
          <Text style={styles.subText}>Welcome back</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={{color:"#fff", fontWeight:"700"}}>
            {user.imageData ? (
            <Image source={{ uri: `data:image/jpeg;base64,${user.imageData}` }} style={styles.image} />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>{getInitial()}</Text>
          )}</Text>
        </View>
      </View>

      {/* MEMBERSHIP CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Become a Glow Member ✨</Text>
        <Text style={styles.cardSubtitle}>
          Earn rewards every time you shop
        </Text>

        <TouchableOpacity>
          <Text style={styles.link}>Unlock Benefits →</Text>
        </TouchableOpacity>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.section}>
        <MenuItem icon="cube-outline" title="Orders" subtitle="Track, return or cancel orders" />
        <MenuItem icon="wallet-outline" title="Wallet" subtitle="Check your balance" />
        <MenuItem icon="scan-outline" title="Skin Profile" subtitle="View AI skin reports" onPress={() => router.push("/scan")}/>
        <MenuItem icon="time-outline" title="Scan History" subtitle="See past scans & progress"  onPress={getScanHistory}/>

        {/* Toggle */}
        <View style={styles.menuRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Notifications</Text>
            <Text style={styles.menuSubtitle}>Get offers & scan reminders</Text>
          </View>

          <Switch value={enabled} onValueChange={toggleNotifications}   trackColor={{ false: "#FAB0AF", true: "#A5D6A7" }}  // grey → soft green
  thumbColor={enabled ? "#2E7D32" : "#ffffff"} ios_backgroundColor="#f7d0dd" />
        </View>
      </View>

      {/* SETTINGS */}
      <Text style={styles.sectionHeader}>Settings</Text>

      <View style={styles.section}>
        <MenuItem icon="location-outline" title="Addresses" subtitle="Manage saved addresses" />
        <MenuItem icon="card-outline" title="Payment Methods" subtitle="Manage cards & UPI" />
        <MenuItem icon="person-outline" title="Profile Settings" subtitle="Edit profile details" onPress={getProfileDetails} />
      </View>

      {/* FOOTER */}
      <Text style={styles.sectionHeader}>More</Text>

      <View style={styles.section}>
        <MenuItem icon="lock-closed-outline" title="Privacy Policy" />
        <MenuItem icon="document-text-outline" title="Terms & Conditions" />
        <MenuItem icon="information-circle-outline" title="About YourTrulyCare" />
      </View>

      <View style={{height:50}} />
    </ScrollView>
  );
}

const MenuItem = ({ icon, title, subtitle, onPress }: any) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#444" />

    <View style={{marginLeft:14, flex:1}}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>

    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);


const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F7F8FA",
    padding:18
  },

  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:20,
    marginBottom:20
  },

  greeting:{
    fontSize:26,
    fontWeight:"700"
  },

  subText:{
    color:"#777",
    marginTop:4
  },

  avatar:{
    height:52,
    width:52,
    borderRadius:26,
    backgroundColor:"#FAB0AF",
    alignItems:"center",
    overflow: "hidden",
    justifyContent:"center"
  },
  image: {
    width: "100%", // fill the parent
    height: "100%", // fill the parent
    resizeMode: "cover", // maintain aspect ratio and cover the circle
  },
  card:{
    backgroundColor:"#fff",
    padding:18,
    borderRadius:16,
    marginBottom:22,
    elevation:3
  },

  cardTitle:{
    fontSize:16,
    fontWeight:"700"
  },

  cardSubtitle:{
    marginTop:4,
    color:"#777"
  },

  link:{
    marginTop:10,
    color:"#6C63FF",
    fontWeight:"600"
  },

  section:{
    backgroundColor:"#fff",
    borderRadius:16,
    paddingVertical:6,
    marginBottom:22
  },

  sectionHeader:{
    fontWeight:"700",
    marginBottom:10,
    marginLeft:4,
    color:"#555"
  },

  menuRow:{
    flexDirection:"row",
    alignItems:"center",
    padding:16,
    borderBottomWidth:0.5,
    borderColor:"#eee"
  },

  menuTitle:{
    fontWeight:"600"
  },

  menuSubtitle:{
    color:"#777",
    fontSize:12,
    marginTop:2
  }

});
