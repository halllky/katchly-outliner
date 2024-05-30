namespace FlexTree {
    using System.Text.Json;
    using System.Text.Json.Nodes;

    static partial class Util {
        public static void ModifyJsonSrializerOptions(JsonSerializerOptions option) {
            // 日本語文字がUnicode変換されるのを避ける
            option.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All);

            // json中のenumの値を名前で設定できるようにする
            var enumConverter = new System.Text.Json.Serialization.JsonStringEnumConverter();
            option.Converters.Add(enumConverter);

            // カスタムコンバータ
            option.Converters.Add(new CustomJsonConverters.IntegerValueConverter());

            option.Converters.Add(new CustomJsonConverters.親集約KeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.ChildrenKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.参照先KeysJsonValueConverter());
        }
        public static JsonSerializerOptions GetJsonSrializerOptions() {
            var option = new System.Text.Json.JsonSerializerOptions();
            ModifyJsonSrializerOptions(option);
            return option;
        }

        public static string ToJson<T>(this T obj) {
            return JsonSerializer.Serialize(obj, GetJsonSrializerOptions());
        }
        public static T ParseJson<T>(string? json) {
            if (json == null) throw new ArgumentNullException(nameof(json));
            return JsonSerializer.Deserialize<T>(json, GetJsonSrializerOptions())!;
        }
        public static object ParseJson(string? json, Type type) {
            if (json == null) throw new ArgumentNullException(nameof(json));
            return JsonSerializer.Deserialize(json, type, GetJsonSrializerOptions())!;
        }
        /// <summary>
        /// 単に <see cref="JsonSerializer.Deserialize(JsonElement, Type, JsonSerializerOptions?)"/> で object?[] を指定すると JsonElement[] 型になり各要素のキャストができないためその回避
        /// </summary>
        public static object?[] ParseJsonAsObjectArray(string? json) {
            return ParseJson<JsonElement[]>(json)
                .Select(jsonElement => (object?)(jsonElement.ValueKind switch {
                    JsonValueKind.Undefined => null,
                    JsonValueKind.Null => null,
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    JsonValueKind.String => jsonElement.GetString(),
                    JsonValueKind.Number => jsonElement.GetDecimal(),
                    _ => jsonElement,
                }))
                .ToArray();
        }
        /// <summary>
        /// JSONから復元されたオブジェクトを事後的に特定の型として扱いたいときに用いる
        /// </summary>
        public static T EnsureObjectType<T>(object? obj) where T : new() {
            return (T)EnsureObjectType(obj, typeof(T));
        }
        /// <summary>
        /// JSONから復元されたオブジェクトを事後的に特定の型として扱いたいときに用いる
        /// </summary>
        public static object EnsureObjectType(object? obj, Type type) {
            if (obj == null) return Activator.CreateInstance(type) ?? throw new ArgumentException(nameof(type));
            var json = obj as string ?? ToJson(obj);
            return ParseJson(json, type);
        }
    }
}

namespace FlexTree.CustomJsonConverters {
    using System.Text;
    using System.Text.Json;
    using System.Text.Json.Serialization;

    class IntegerValueConverter : JsonConverter<int?> {
        public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
    
            return reader.TryGetDecimal(out var dec)
                ? (int)dec
                : null;
    
            // var jsonValue = reader.GetString()?.Trim();
            // if (jsonValue == null) return null;
            // 
            // var builder = new StringBuilder();
            // foreach (var character in jsonValue) {
            //     if (character == ',' || character == '，') {
            //         // カンマ区切りは無視
            //         continue;
            //     } else if (character == '.' || character == '．') {
            //         // 小数点以下は切り捨て
            //         break;
            //     } else if (char.IsDigit(character)) {
            //         // 全角数値は半角数値に変換
            //         builder.Append(char.GetNumericValue(character));
            //     } else {
            //         builder.Append(character);
            //     }
            // }
            // 
            // var converted = builder.ToString();
            // return string.IsNullOrEmpty(converted) ? null : int.Parse(converted);
        }
    
        public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
            } else {
                writer.WriteNumberValue((decimal)value);
            }
            // writer.WriteStringValue(value?.ToString());
        }
    }

    /// <summary>
    /// <see cref="親集約Keys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class 親集約KeysJsonValueConverter : JsonConverter<親集約Keys?> {
        public override 親集約Keys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"親集約Keysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new 親集約Keys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, 親集約Keys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="ChildrenKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class ChildrenKeysJsonValueConverter : JsonConverter<ChildrenKeys?> {
        public override ChildrenKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var Children_IDValue = objArray.ElementAtOrDefault(0);
            if (Children_IDValue != null && Children_IDValue is not string)
                throw new InvalidOperationException($"ChildrenKeysの値の変換に失敗しました。Children_IDの位置の値がstring型ではありません: {Children_IDValue}");
    
            var IDValue = objArray.ElementAtOrDefault(1);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"ChildrenKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new ChildrenKeys {
                Parent = new() {
                    ID = (string?)Children_IDValue,
                },
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, ChildrenKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                    value.ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="参照先Keys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class 参照先KeysJsonValueConverter : JsonConverter<参照先Keys?> {
        public override 参照先Keys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var 参照先IDValue = objArray.ElementAtOrDefault(0);
            if (参照先IDValue != null && 参照先IDValue is not string)
                throw new InvalidOperationException($"参照先Keysの値の変換に失敗しました。参照先IDの位置の値がstring型ではありません: {参照先IDValue}");
    
            return new 参照先Keys {
                参照先ID = (string?)参照先IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, 参照先Keys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.参照先ID,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

}
