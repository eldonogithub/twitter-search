package ca.blackperl;

import java.util.HashMap;
import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;

/**
 * Listens to the twitter status stream
 */
final class PhraseListener implements StatusListener
{
    /**
     * logger
     */
    private static final Log log = LogFactory.getLog(PhraseListener.class);

    private String[] args;
    private HashMap<String, Integer> badwords = new HashMap<String, Integer>();
    private int count = 0;
    

    public PhraseListener(String[] args)
    {
        this.args = args;
        
        // Initialize the bad word counters
        for (String keyword : args)
        {
            badwords.put(keyword, Integer.valueOf(0));
        }
    }

    /**
     * Receives the status update and determines if it is a complete match.
     * 
     * @see twitter4j.StatusListener#onStatus(twitter4j.Status)
     */
    public void onStatus(Status status)
    {
        // The twitter library calls Tweets a Status update. 
        String text = status.getText().toLowerCase();
        
        // count the received messages
        count = count + 1;
        
        // check each search phrase for a match
        for (String keyword : getArgs())
        {
            if (text.contains(keyword))
            {
                Integer value = badwords.get(keyword);
                
                // if it is a match count it, multiple matches can occur in one
                // status update.
                badwords.put(keyword,
                        Integer.valueOf(value.intValue() + 1));
            }
        }
        log.info(String.format("[%6d] @%s - %s", getCount(),
                status.getUser().getScreenName(),
                status.getText()) );
    }

    public void onDeletionNotice(
            StatusDeletionNotice statusDeletionNotice)
    {
        log.debug("Got a status deletion notice id:"
                + statusDeletionNotice.getStatusId());
    }

    public void onTrackLimitationNotice(int numberOfLimitedStatuses)
    {
        log.warn("Got track limitation notice:"
                + numberOfLimitedStatuses);
    }

    public void onScrubGeo(long userId, long upToStatusId)
    {
        log.debug("Got scrub_geo event userId:" + userId
                + " upToStatusId:" + upToStatusId);
    }

    public void onStallWarning(StallWarning warning)
    {
        log.warn("Got stall warning:" + warning);
    }

    public void onException(Exception ex)
    {
        log.error(ex, ex);
    }

    public Iterator<String> iterator()
    {
        return badwords.keySet().iterator();
    }

    public Integer get(String keyword)
    {
        return badwords.get(keyword);
    }

    public int getCount()
    {
        return count;
    }

    public String[] getArgs()
    {
        return args;
    }

}
