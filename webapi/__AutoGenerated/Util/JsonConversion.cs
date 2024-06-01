namespace Katchly {
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

            option.Converters.Add(new CustomJsonConverters.RowKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.AttrsKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.RowTypeKeysJsonValueConverter());
            option.Converters.Add(new CustomJsonConverters.ColumnsKeysJsonValueConverter());
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

namespace Katchly.CustomJsonConverters {
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
    /// <see cref="RowKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class RowKeysJsonValueConverter : JsonConverter<RowKeys?> {
        public override RowKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"RowKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new RowKeys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, RowKeys? value, JsonSerializerOptions options) {
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
    /// <see cref="AttrsKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class AttrsKeysJsonValueConverter : JsonConverter<AttrsKeys?> {
        public override AttrsKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var Attrs_IDValue = objArray.ElementAtOrDefault(0);
            if (Attrs_IDValue != null && Attrs_IDValue is not string)
                throw new InvalidOperationException($"AttrsKeysの値の変換に失敗しました。Attrs_IDの位置の値がstring型ではありません: {Attrs_IDValue}");
    
            var ColType_Columns_IDValue = objArray.ElementAtOrDefault(1);
            if (ColType_Columns_IDValue != null && ColType_Columns_IDValue is not string)
                throw new InvalidOperationException($"AttrsKeysの値の変換に失敗しました。ColType_Columns_IDの位置の値がstring型ではありません: {ColType_Columns_IDValue}");
    
            var ColType_ColumnIdValue = objArray.ElementAtOrDefault(2);
            if (ColType_ColumnIdValue != null && ColType_ColumnIdValue is not string)
                throw new InvalidOperationException($"AttrsKeysの値の変換に失敗しました。ColType_ColumnIdの位置の値がstring型ではありません: {ColType_ColumnIdValue}");
    
            return new AttrsKeys {
                Parent = new() {
                    ID = (string?)Attrs_IDValue,
                },
                ColType = new() {
                    Parent = new() {
                        ID = (string?)ColType_Columns_IDValue,
                    },
                    ColumnId = (string?)ColType_ColumnIdValue,
                },
            };
        }
    
        public override void Write(Utf8JsonWriter writer, AttrsKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                    value.ColType?.Parent?.ID,
                    value.ColType?.ColumnId,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

    /// <summary>
    /// <see cref="RowTypeKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class RowTypeKeysJsonValueConverter : JsonConverter<RowTypeKeys?> {
        public override RowTypeKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var IDValue = objArray.ElementAtOrDefault(0);
            if (IDValue != null && IDValue is not string)
                throw new InvalidOperationException($"RowTypeKeysの値の変換に失敗しました。IDの位置の値がstring型ではありません: {IDValue}");
    
            return new RowTypeKeys {
                ID = (string?)IDValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, RowTypeKeys? value, JsonSerializerOptions options) {
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
    /// <see cref="ColumnsKeys"/> 型のプロパティの値が
    /// C#とHTTPリクエスト・レスポンスの間で変換されるときの処理を定義します。
    /// </summary>
    public class ColumnsKeysJsonValueConverter : JsonConverter<ColumnsKeys?> {
        public override ColumnsKeys? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
            var jsonArray = reader.GetString();
            if (jsonArray == null) return null;
            var objArray = Util.ParseJsonAsObjectArray(jsonArray);
    
            var Columns_IDValue = objArray.ElementAtOrDefault(0);
            if (Columns_IDValue != null && Columns_IDValue is not string)
                throw new InvalidOperationException($"ColumnsKeysの値の変換に失敗しました。Columns_IDの位置の値がstring型ではありません: {Columns_IDValue}");
    
            var ColumnIdValue = objArray.ElementAtOrDefault(1);
            if (ColumnIdValue != null && ColumnIdValue is not string)
                throw new InvalidOperationException($"ColumnsKeysの値の変換に失敗しました。ColumnIdの位置の値がstring型ではありません: {ColumnIdValue}");
    
            return new ColumnsKeys {
                Parent = new() {
                    ID = (string?)Columns_IDValue,
                },
                ColumnId = (string?)ColumnIdValue,
            };
        }
    
        public override void Write(Utf8JsonWriter writer, ColumnsKeys? value, JsonSerializerOptions options) {
            if (value == null) {
                writer.WriteNullValue();
    
            } else {
                object?[] objArray = [
                    value.Parent?.ID,
                    value.ColumnId,
                ];
                var jsonArray = objArray.ToJson();
                writer.WriteStringValue(jsonArray);
            }
        }
    }

}
