import { View, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * Language Selection Screen
 * First step of onboarding for ASHA workers
 */
export default function LanguageSelectScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  ];

  const handleContinue = () => {
    // Save language preference and navigate to login
    router.push({
      pathname: "./login",
      params: { language: selectedLanguage },
    });
  };

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6 gap-8 justify-between">
          {/* Header */}
          <View className="gap-4 items-center">
            <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center">
              <Text className="text-4xl">🌍</Text>
            </View>
            <View className="gap-2 items-center">
              <Text className="text-3xl font-bold text-foreground">Select Language</Text>
              <Text className="text-base text-muted text-center">
                Choose your preferred language for the app
              </Text>
            </View>
          </View>

          {/* Language Grid */}
          <View className="gap-3">
            {languages.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className={`border-2 rounded-xl p-4 flex-row items-center justify-between ${
                  selectedLanguage === lang.code
                    ? "bg-primary/10 border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <View className="gap-1 flex-1">
                  <Text className="text-lg font-semibold text-foreground">{lang.name}</Text>
                  <Text className="text-sm text-muted">{lang.nativeName}</Text>
                </View>
                {selectedLanguage === lang.code && (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Text className="text-white text-sm">✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-primary rounded-lg py-4 items-center justify-center active:opacity-80"
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
