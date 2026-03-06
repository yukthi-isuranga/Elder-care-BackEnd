export const normalizeDocs = (docs: any[]) => {
  return docs
    .map((d) => ({
      type: d.type,
      fileUrl: d.fileUrl,
      verified: d.verified,
    }))
    .sort((a, b) => a.fileUrl.localeCompare(b.fileUrl));
};
