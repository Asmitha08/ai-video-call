class CaptionModel {
  final String id;
  final String speakerId;
  final String displayName;
  final String originalText;
  final String translatedText;
  final String sourceLang;
  final String targetLang;
  final bool isFinal;
  final int timestamp;

  CaptionModel({
    required this.id,
    required this.speakerId,
    required this.displayName,
    required this.originalText,
    required this.translatedText,
    required this.sourceLang,
    required this.targetLang,
    this.isFinal = true,
    required this.timestamp,
  });

  factory CaptionModel.fromJson(Map<String, dynamic> json) {
    return CaptionModel(
      id: json['id'] ?? '${json['fromSocketId'] ?? json['speakerId'] ?? 'user'}-${DateTime.now().millisecondsSinceEpoch}',
      speakerId: json['fromSocketId'] ?? json['speakerId'] ?? 'unknown',
      displayName: json['displayName'] ?? 'Speaker',
      originalText: json['originalText'] ?? json['text'] ?? '',
      translatedText: json['translatedText'] ?? json['originalText'] ?? json['text'] ?? '',
      sourceLang: json['sourceLang'] ?? 'en',
      targetLang: json['targetLang'] ?? 'te',
      isFinal: json['isFinal'] ?? true,
      timestamp: json['timestamp'] ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  CaptionModel copyWith({
    String? id,
    String? speakerId,
    String? displayName,
    String? originalText,
    String? translatedText,
    String? sourceLang,
    String? targetLang,
    bool? isFinal,
    int? timestamp,
  }) {
    return CaptionModel(
      id: id ?? this.id,
      speakerId: speakerId ?? this.speakerId,
      displayName: displayName ?? this.displayName,
      originalText: originalText ?? this.originalText,
      translatedText: translatedText ?? this.translatedText,
      sourceLang: sourceLang ?? this.sourceLang,
      targetLang: targetLang ?? this.targetLang,
      isFinal: isFinal ?? this.isFinal,
      timestamp: timestamp ?? this.timestamp,
    );
  }
}
