## Note
Although this text explanation is written well enough for you to understand, I encourage you to checkout the video explanation in [Youtube](http://www.youtube.com). Enjoy!

## Approach #1: Brute Force [Time Limit Exceeded]
### Intuition and Algorithm

The brute force algorithm is to try all combinations of either taking the left most, or the right most available card. We can do this by using recursive backtracking. 

Notice that if you are given the number of cards you can take, along with the index of the left and right most available card, then the answer will be the maximum of taking either the left most available card OR the right most available card, and reducing the number of cards you can take by 1. In other words:
```
k = number of cards you can pick
left = index of left most available card
right = index of right most available card

ans(k, left, right) = max(cardPoints[left] + ans(k - 1, left + 1, right), cardPoints[right] + ans(k - 1, left, right - 1))
```
But how will we know when to stop the recursion? Well, think about what ```ans(k = 0, left, right)``` represents. It represents the maximum value from taking 0 cards; after that point, we can pretty much disregard the values of left and right. This is because the maximum value we can get from taking 0 cards is, well, 0! So we can add to our definition before:
```
if (k > 0)
    ans(k, left, right) = max(cardPoints[left] + ans(k - 1, left + 1, right), cardPoints[right] + ans(k - 1, left, right - 1))
if (k == 0)
    ans(k, left, right) = 0
```
Note that we are assuming *k* >= 0.

At that point, we just have to think about what values we should give as the initial *k*, *left*, and *right*. 
> *k* should just be the argument givent to us by the user. 
> *left* should be 0, since at the beginning, the left most available card is the first card in cardPoints
> *right* should be cardPoints.length - 1, since at the beginning, the right most available card is the last card in cardPoints.

With that in mind, lets code up a solution in Java:

```java
class Solution {
    public int maxScore(int[] cardPoints, int k) {
        return maxScore(cardPoints, k, 0, cardPoints.length - 1);
    }

    public int maxScore(int[] cardPoints, int k, int left, int right) {
        if (k == 0) {
            return 0;
        }

        int L = cardPoints[left] + maxScore(cardPoints, k - 1, left + 1, right);
        int R = cardPoints[right] + maxScore(cardPoints, k - 1, left, right - 1);

        return Math.max(L, R);
    }
}
```
Complexity Analysis

* Time Complexity is: 
> O(2<sup>k</sup>). Each call to maxScore will produce 2 more recursive calls to itself, this will happen a total of k levels. Thus, there will be 2<sup>k</sup> calls to maxScore(0, left, right), each of which is doing constant work.

* Space Complexity is:
> O(k). At each call to maxScore, we keep L and R which in itself is constant space. But notice that at the lowest level, we would have stored *k* L or R values. This would lead to a space complexity of O(k)

---

## Approach #2: Complement Subarray [Accepted]
### Intuition and Algorithm

For this solution, we want to look at the cards we don't take instead of the ones that we do. Notice that regardless of which combination of cards we take, there will always be a contiguous subarray of length (cardPoints.length - k) within cardPoints that we __don't__ take. For the purposes of this explanation, let ```complementLength = cardPoints.length - k```. 
We can find the total sum of our entire array in linear time, and we can also traverse with our complement subarray in linear time. Notice that the total points that we can get is:
```
total points = total sum of entire array - sum of complement array
```
As such, we can just use this formula as we traverse our complement array, while keeping track of the maximum. This is how the code will look like in Java:

```java
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
```