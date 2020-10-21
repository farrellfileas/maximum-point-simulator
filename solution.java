class Solution {
    public int maxScore(int[] cardPoints, int k) {
        int sum = 0;
        int subarraySum = 0;
        int subarrayStart = 0;
        int complementLength = cardPoints.length - k;
        for (int i = 0; i < cardPoints.length; i++) {
            if (i < complementLength) {
                subarraySum += cardPoints[i];
            }
            
            sum += cardPoints[i];
        }
        
        int max = sum - subarraySum;
        
        for (int i = complementLength; i < cardPoints.length; i++) {
            subarraySum = subarraySum - cardPoints[i - complementLength] + cardPoints[i];
            
            max = Math.max(sum - subarraySum, max);
        }
        
        return max;
    }
}